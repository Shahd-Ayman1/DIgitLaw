from __future__ import annotations

from app.core.logging import get_logger
from app.graphs.legal_assistant.state import LegalAssistantState
from app.services.llm_service import get_llm_service

logger = get_logger("digitlaw.graph.generation")

SYSTEM_PROMPT = """أنت "ديجيتلو" مساعد قانوني ذكي متخصص في القانون المصري.

التعليمات الصارمة:
1. أجب فقط بناءً على المواد القانونية المرفقة أدناه (السياق). لا تستخدم أي معرفة خارجية.
2. إذا لم يحتوِ السياق على إجابة كافية، صرّح بذلك بوضوح وانصح المستخدم بالتواصل مع محامٍ مرخص.
3. استخدم اللغة العربية المصرية الواضحة والمبسطة في الإجابة.
4. اذكر دائمًا أرقام المواد والقوانين التي استندت إليها بالشكل: (المادة X من القانون Y لسنة Z).
5. لا تقدم نصيحة قانونية شخصية نهائية؛ قدّم تفسيرًا للنص القانوني فقط، واذكر أنه يجب التحقق من محامٍ للحالات الفردية.
6. لا تختلق مواد أو قوانين غير موجودة في السياق.
"""

USER_PROMPT_TEMPLATE = """السؤال:
{question}

السياق القانوني (مواد مستردة):
{context}

اكتب إجابة دقيقة، مبنية على السياق فقط، مع ذكر أرقام المواد والقوانين بين قوسين في نهاية كل فكرة."""


def build_context(state: LegalAssistantState) -> str:
    citations = state.get("citations", [])
    if not citations:
        return "لا توجد مواد قانونية مسترجعة."

    blocks = []
    for i, c in enumerate(citations, start=1):
        law_ref = f"{c.law_name}"
        if c.law_number:
            law_ref += f" رقم {c.law_number}"
        if c.law_year:
            law_ref += f" لسنة {c.law_year}"
        article_ref = f"المادة {c.article_number}" if c.article_number else ""
        blocks.append(f"[{i}] {article_ref} - {law_ref}\n{c.text}")
    return "\n\n".join(blocks)


async def generate_answer_node(state: LegalAssistantState) -> LegalAssistantState:
    if state.get("retrieval_empty"):
        return {
            **state,
            "raw_answer": "",
            "prompt": "",
        }

    context = build_context(state)
    user_prompt = USER_PROMPT_TEMPLATE.format(question=state["question"], context=context)

    llm = get_llm_service()
    answer = await llm.generate(SYSTEM_PROMPT, user_prompt)

    logger.info("answer_generated", extra={"extra_fields": {"answer_len": len(answer)}})

    return {
        **state,
        "prompt": user_prompt,
        "raw_answer": answer,
    }
