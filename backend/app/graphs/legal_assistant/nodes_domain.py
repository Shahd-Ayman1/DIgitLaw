from __future__ import annotations

import re

from app.core.logging import get_logger
from app.graphs.legal_assistant.state import LegalAssistantState
from app.schemas.chat import LegalDomain

logger = get_logger("digitlaw.graph.domain")

# Keyword lexicon for Egyptian Arabic legal domains.
# category_filter values must match the 'category' field stored in Qdrant payloads.
DOMAIN_KEYWORDS: dict[LegalDomain, list[str]] = {
    LegalDomain.LABOR: [
        "عامل", "عمال", "فصل", "أجر", "مرتب", "شركة", "صاحب العمل", "إجازة",
        "استقالة", "إنهاء الخدمة", "تعويض", "نقابة", "ساعات العمل", "عقد عمل",
        "تأمينات", "معاش", "إضراب", "موظف",
    ],
    LegalDomain.TENANCY: [
        "إيجار", "مؤجر", "مستأجر", "شقة", "عقد إيجار", "طرد", "إخلاء",
        "فسخ العقد", "عين مؤجرة", "إيجار قديم", "إيجار جديد", "العقار",
        "زيادة الإيجار", "الوحدة السكنية",
    ],
    LegalDomain.FAMILY: [
        "زواج", "طلاق", "حضانة", "نفقة", "خلع", "رؤية الأبناء", "ميراث",
        "وصية", "نسب", "زوجة", "زوج", "أولاد", "ولاية", "مهر", "عدة",
    ],
    LegalDomain.CRIMINAL: [
        "جريمة", "سرقة", "قتل", "ضرب", "نصب", "احتيال", "عقوبة", "سجن",
        "غرامة", "جنحة", "جناية", "بلاغ", "نيابة", "محبوس", "قضية جنائية",
    ],
    LegalDomain.COMMERCIAL: [
        "شركة", "تجاري", "شيك", "كمبيالة", "إفلاس", "تجارة", "تاجر",
        "سجل تجاري", "شراكة", "عقد تجاري", "علامة تجارية",
    ],
    LegalDomain.ADMINISTRATIVE: [
        "حكومي", "إداري", "قرار إداري", "موظف عام", "ديوان", "مجلس الدولة",
        "ترخيص", "وزارة", "هيئة",
    ],
    LegalDomain.CIVIL: [
        "عقد", "تعويض", "ملكية", "بيع", "شراء", "ضرر", "مسؤولية", "دين",
        "التزام", "عقد بيع",
    ],
}

# Maps detected domain -> (category, law_type) filters used in Qdrant retrieval.
# These must align with metadata values present in the corpus.
DOMAIN_TO_FILTERS: dict[LegalDomain, tuple[str | None, str | None]] = {
    LegalDomain.LABOR: ("labor_law", None),
    LegalDomain.TENANCY: ("tenancy_law", None),
    LegalDomain.FAMILY: ("personal_status_law", None),
    LegalDomain.CRIMINAL: ("criminal_law", None),
    LegalDomain.COMMERCIAL: ("commercial_law", None),
    LegalDomain.ADMINISTRATIVE: ("administrative_law", None),
    LegalDomain.CIVIL: ("civil_law", None),
    LegalDomain.UNKNOWN: (None, None),
}


def _normalize_arabic(text: str) -> str:
    text = re.sub(r"[\u064B-\u0652]", "", text)  # remove diacritics
    text = text.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا")
    text = text.replace("ى", "ي").replace("ة", "ه")
    return text


def detect_domain_node(state: LegalAssistantState) -> LegalAssistantState:
    question = state["question"]
    normalized = _normalize_arabic(question)

    scores: dict[LegalDomain, int] = {d: 0 for d in DOMAIN_KEYWORDS}
    for domain, keywords in DOMAIN_KEYWORDS.items():
        for kw in keywords:
            if _normalize_arabic(kw) in normalized:
                scores[domain] += 1

    best_domain = max(scores, key=lambda d: scores[d])
    if scores[best_domain] == 0:
        best_domain = LegalDomain.UNKNOWN

    category, law_type = DOMAIN_TO_FILTERS[best_domain]

    logger.info(
        "domain_detected",
        extra={"extra_fields": {"domain": best_domain.value, "scores": {k.value: v for k, v in scores.items()}}},
    )

    return {
        **state,
        "domain": best_domain,
        "category_filter": category,
        "law_type_filter": law_type,
    }
