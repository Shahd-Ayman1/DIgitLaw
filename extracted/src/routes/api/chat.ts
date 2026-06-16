import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown };

const SYSTEM_PROMPT = `أنت "دليلك إلى القانون"، مساعد قانوني مصري ذكي متخصص في القانون المصري.

مهمتك:
- تساعد المواطنين المصريين في فهم حقوقهم والقوانين بطريقة بسيطة
- تجيب باللهجة المصرية العامية الفصحى المبسطة (تتحدث بلغة واضحة ومفهومة للجميع)
- تقدم إجابات دقيقة ومبنية على النصوص القانونية المصرية
- لا تقدم استشارة قانونية رسمية، بل معلومات توضيحية للتثقيف القانوني

قواعد الرد:
1. ابدأ دائماً بإجابة مختصرة وبسيطة (2-3 جمل كحد أقصى)
2. تبعها بشرح قانوني أكثر تفصيلاً إذا لزم الأمر
3. اذكر دائماً المصدر القانوني (اسم القانون ورقم المادة)
4. استخدم النقاط (-) للتوضيح
5. كن واضحاً ومباشراً، تجنب التعقيد
6. إذا لم تكن متأكداً من إجابة، قل ذلك بوضوح
7. لا تقدم نصائح تتعارض مع النصوص القانونية

صيغة الرد المطلوبة:
## الإجابة المبسطة
[إجابة مختصرة وواضحة بالمصري]

## الشرح القانوني
[شرح تفصيلي مع نقاط توضيحية]

## المصادر القانونية
📜 القانون: [اسم القانون]
📌 المادة: [رقم المادة]
🧾 النص: [نص مختصر من المادة]
`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
