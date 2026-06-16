import { createFileRoute } from "@tanstack/react-router";
import SiteLayout from "@/components/site-layout";
import LegalChat from "@/components/legal-chat";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "استشارة قانونية — بيّنة" },
      { name: "description", content: "ابدأ استشارتك القانونية مع بيّنة واحصل على إجابة مدعومة بالنصوص القانونية المصرية." },
      { property: "og:title", content: "استشارة قانونية — بيّنة" },
      { property: "og:description", content: "ابدأ استشارتك القانونية مع بيّنة." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <SiteLayout>
      <div className="h-[calc(100vh-4rem)]">
        <LegalChat />
      </div>
    </SiteLayout>
  );
}
