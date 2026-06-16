from __future__ import annotations

from app.core.config import get_settings
from app.core.logging import get_logger
from app.graphs.legal_assistant.state import LegalAssistantState
from app.services.embedding_service import get_embedding_service
from app.services.retrieval_service import get_retrieval_service

logger = get_logger("digitlaw.graph.retrieval")
settings = get_settings()


def retrieve_node(state: LegalAssistantState) -> LegalAssistantState:
    embedder = get_embedding_service()
    retriever = get_retrieval_service()

    vector = embedder.embed_query(state["question"])

    citations = retriever.search(
    query_vector=vector,
    category=None,
    law_type=None,
    top_k=settings.RETRIEVAL_TOP_K,
    score_threshold=settings.RETRIEVAL_SCORE_THRESHOLD,
)

    citations = citations[: settings.RERANK_TOP_N]

    logger.info(
        "retrieval_completed",
        extra={"extra_fields": {"num_results": len(citations), "category": state.get("category_filter")}},
    )

    return {
        **state,
        "citations": citations,
        "retrieval_empty": len(citations) == 0,
    }
