from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, List, Optional

from qdrant_client import QdrantClient
from qdrant_client.http import models as qmodels

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.chat import Citation

logger = get_logger("digitlaw.retrieval")
settings = get_settings()


class RetrievalService:
    def __init__(self, url: str, api_key: Optional[str], collection: str):
        self.collection = collection
        self._qdrant_available = False
        try:
            self.client = QdrantClient(url=url, api_key=api_key)
            # Test connection
            self.client.get_collections()
            self._qdrant_available = True
            logger.info("qdrant_connected", extra={"extra_fields": {"url": url}})
        except Exception as e:
            logger.warning(
                "qdrant_connection_failed",
                extra={"extra_fields": {"url": url, "error": str(e), "using_fallback": True}}
            )
            self.client = None
            self._qdrant_available = False

    def _build_filter(self, category: Optional[str], law_type: Optional[str]) -> Optional[qmodels.Filter]:
        must: List[qmodels.FieldCondition] = []
        if category:
            must.append(
                qmodels.FieldCondition(key="category", match=qmodels.MatchValue(value=category))
            )
        if law_type:
            must.append(
                qmodels.FieldCondition(key="law_type", match=qmodels.MatchValue(value=law_type))
            )
        if not must:
            return None
        return qmodels.Filter(must=must)

    def search(
        self,
        query_vector: List[float],
        category: Optional[str] = None,
        law_type: Optional[str] = None,
        top_k: int = 8,
        score_threshold: float = 0.45,
    ) -> List[Citation]:
        if not self._qdrant_available:
            logger.warning("qdrant_unavailable_using_fallback_citations")
            return self._fallback_citations()
        
        try:
            query_filter = self._build_filter(category, law_type)

            results = self.client.query_points(
                collection_name=self.collection,
                query=query_vector,
                query_filter=query_filter,
                limit=top_k,
                score_threshold=score_threshold,
                with_payload=True,
            ).points
            print("RESULTS:", len(results))

            

            # Fallback: if metadata-filtered search returns nothing, retry unfiltered
            if not results and query_filter is not None:
                logger.info("retrieval_fallback_unfiltered", extra={"extra_fields": {"category": category}})
                results = self.client.query_points(
                    collection_name=self.collection,
                    query=query_vector,
                    limit=top_k,
                    score_threshold=max(score_threshold - 0.1, 0.0),
                    with_payload=True,
                ).points

            citations = self._to_citations(results)
            return self._deduplicate(citations)
        except Exception as e:
            logger.error("qdrant_search_failed", extra={"extra_fields": {"error": str(e)}})
            return self._fallback_citations()

    @staticmethod
    def _to_citations(points: List[Any]) -> List[Citation]:
        citations = []
        for p in points:
            payload: Dict[str, Any] = p.payload or {}
            citations.append(
                Citation(
                    chunk_id=str(payload.get("chunk_id", p.id)),
                    doc_id=str(payload.get("doc_id", "")),
                    law_name=str(payload.get("law_name", "")),
                    law_number=str(payload.get("law_number")) if payload.get("law_number") else None,
                    law_year=str(payload.get("law_year")) if payload.get("law_year") else None,
                    law_type=payload.get("law_type"),
                    category=payload.get("category"),
                    article_number=str(payload.get("article_number")) if payload.get("article_number") else None,
                    text=str(
                          payload.get(
                            "context_text",
                             payload.get("text", "")
    )
),
                    score=float(p.score),
                )
            )
        return citations

    @staticmethod
    def _deduplicate(citations: List[Citation]) -> List[Citation]:
        """Dedup by (law_name, article_number); keep highest scoring chunk."""
        seen: Dict[tuple, Citation] = {}
        for c in citations:
            key = (c.law_name, c.article_number, c.law_number)
            existing = seen.get(key)
            if existing is None or c.score > existing.score:
                seen[key] = c
        # Preserve descending score order
        return sorted(seen.values(), key=lambda c: c.score, reverse=True)

    @staticmethod
    def _fallback_citations() -> List[Citation]:
        """Return mock citations for local development when Qdrant is unavailable.
        
        These fallbacks cover multiple legal domains to provide reasonable responses
        across different types of legal questions.
        """
        return [
            # Civil Law - Purchase/Sale contracts
            Citation(
                chunk_id="fallback-civil-1",
                doc_id="doc-civil-1",
                law_name="القانون المدني المصري",
                law_number="131",
                law_year="1948",
                law_type="civil",
                category="contracts_sales",
                article_number="434",
                text="البيع هو عقد يلتزم فيه البائع بنقل ملكية شيء والمشتري بدفع الثمن.",
                score=0.90,
            ),
            Citation(
                chunk_id="fallback-civil-2",
                doc_id="doc-civil-2",
                law_name="القانون المدني المصري",
                law_number="131",
                law_year="1948",
                law_type="civil",
                category="contracts_sales",
                article_number="473",
                text="إذا ظهر في الشيء عيب خفي لم يكن المشتري يعلم به وقت البيع فللمشتري أن يطلب إبطال البيع أو انخفاض الثمن.",
                score=0.88,
            ),
            # Family Law - Divorce
            Citation(
                chunk_id="fallback-family-1",
                doc_id="doc-family-1",
                law_name="قانون الأحوال الشخصية",
                law_number="1",
                law_year="1929",
                law_type="personal_status",
                category="marriage",
                article_number="127",
                text="للزوجة أن تطلب الطلاق للضرر من زوجها بطريقة الخلع أو التطليق.",
                score=0.85,
            ),
            # Labor Law
            Citation(
                chunk_id="fallback-labor-1",
                doc_id="doc-labor-1",
                law_name="قانون العمل",
                law_number="12",
                law_year="2003",
                law_type="labor",
                category="employment",
                article_number="119",
                text="لا يجوز فصل الموظف إلا للأسباب المنصوص عليها في القانون وبالإجراءات المقررة.",
                score=0.82,
            ),
        ]


@lru_cache
def get_retrieval_service() -> RetrievalService:
    return RetrievalService(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
        collection=settings.QDRANT_COLLECTION,
    )
