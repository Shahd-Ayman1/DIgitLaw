import pytest

from app.graphs.legal_assistant.nodes_verification import verify_node, FALLBACK_NO_CONTEXT, FALLBACK_UNSAFE
from app.schemas.chat import Citation, LegalDomain


def make_citation(text: str, article_number: str = "10") -> Citation:
    return Citation(
        chunk_id="c1",
        doc_id="d1",
        law_name="قانون العمل",
        law_number="12",
        law_year="2003",
        law_type="labor_law",
        category="labor_law",
        article_number=article_number,
        text=text,
        score=0.8,
    )


def test_empty_retrieval_triggers_fallback():
    state = {
        "question": "هل يجوز فصل العامل بدون سبب؟",
        "domain": LegalDomain.LABOR,
        "retrieval_empty": True,
        "citations": [],
        "raw_answer": "",
        "warnings": [],
    }
    result = verify_node(state)
    assert result["is_fallback"] is True
    assert result["final_answer"] == FALLBACK_NO_CONTEXT
    assert "empty_retrieval" in result["warnings"]


def test_unsafe_request_blocked():
    state = {
        "question": "كيف أتهرب من الضرائب بشكل قانوني؟",
        "domain": LegalDomain.COMMERCIAL,
        "retrieval_empty": False,
        "citations": [make_citation("نص قانوني")],
        "raw_answer": "بعض النصوص",
        "warnings": [],
    }
    result = verify_node(state)
    assert result["is_unsafe"] is True
    assert result["final_answer"] == FALLBACK_UNSAFE


def test_low_faithfulness_triggers_fallback():
    state = {
        "question": "هل يجوز فصل العامل بدون سبب؟",
        "domain": LegalDomain.LABOR,
        "retrieval_empty": False,
        "citations": [make_citation("نص المادة العاشرة بخصوص الفصل التعسفي للعامل")],
        "raw_answer": "هذه إجابة عشوائية تماماً لا علاقة لها بالسياق المسترجع على الإطلاق وتحتوي كلمات مختلفة كلياً",
        "warnings": [],
    }
    result = verify_node(state)
    assert result["is_fallback"] is True
    assert result["faithfulness_score"] < 0.30


def test_grounded_answer_passes():
    citation = make_citation("لا يجوز فصل العامل بدون سبب مشروع وفقاً للمادة 10")
    state = {
        "question": "هل يجوز فصل العامل بدون سبب؟",
        "domain": LegalDomain.LABOR,
        "retrieval_empty": False,
        "citations": [citation],
        "raw_answer": "لا يجوز فصل العامل بدون سبب مشروع وفقاً للمادة 10 من القانون",
        "warnings": [],
    }
    result = verify_node(state)
    assert result["is_fallback"] is False
    assert result["faithfulness_score"] >= 0.30
    assert result["citation_valid"] is True


def test_citation_mismatch_flagged():
    citation = make_citation("نص يتعلق بالموضوع", article_number="10")
    state = {
        "question": "هل يجوز فصل العامل بدون سبب؟",
        "domain": LegalDomain.LABOR,
        "retrieval_empty": False,
        "citations": [citation],
        "raw_answer": "نص يتعلق بالموضوع وفقاً للمادة 99 من القانون نص يتعلق بالموضوع",
        "warnings": [],
    }
    result = verify_node(state)
    if not result["is_fallback"]:
        assert result["citation_valid"] is False
        assert "citation_mismatch" in result["warnings"]
