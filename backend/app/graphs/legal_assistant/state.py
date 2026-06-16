from __future__ import annotations

from typing import List, Optional, TypedDict

from app.schemas.chat import Citation, LegalDomain


class LegalAssistantState(TypedDict, total=False):
    question: str
    conversation_id: str
    request_id: str

    domain: LegalDomain
    category_filter: Optional[str]
    law_type_filter: Optional[str]

    citations: List[Citation]
    retrieval_empty: bool

    prompt: str
    raw_answer: str

    faithfulness_score: float
    citation_valid: bool
    is_unsafe: bool

    final_answer: str
    is_fallback: bool
    warnings: List[str]
