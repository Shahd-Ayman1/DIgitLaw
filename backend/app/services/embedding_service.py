from __future__ import annotations

from functools import lru_cache
from typing import List

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("digitlaw.embeddings")

settings = get_settings()


class EmbeddingService:
    """Wraps BAAI/bge-m3 via sentence-transformers / FlagEmbedding.

    Loaded lazily and cached as a singleton to avoid reloading the model
    on every request.
    """

    def __init__(self, model_name: str, device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self._model = None
        self._is_flag = False

    def _load(self):
        if self._model is None:
            logger.info("loading_embedding_model", extra={"extra_fields": {"model": self.model_name}})
            try:
                from FlagEmbedding import BGEM3FlagModel

                self._model = BGEM3FlagModel(self.model_name, use_fp16=self.device != "cpu")
                self._is_flag = True
            except Exception:
                logger.warning("FlagEmbedding import failed, falling back to sentence-transformers")
                try:
                    from sentence_transformers import SentenceTransformer

                    # try loading a small sentence-transformers model
                    self._model = SentenceTransformer("BAAI/bge-large-en-v1.5")
                    self._is_flag = False
                except Exception:
                    # As a last resort for local development (no heavy deps),
                    # use a deterministic hash-based embedding generator.
                    logger.warning("sentence-transformers import failed; using hash-based fallback embeddings")
                    self._model = None
                    self._is_flag = False
        return self._model

    def embed_query(self, text: str) -> List[float]:
        model = self._load()
        if self._is_flag:
            output = model.encode([text], return_dense=True, return_sparse=False, return_colbert_vecs=False)
            return output["dense_vecs"][0].tolist()
        else:
            if model is not None:
                vec = model.encode(text)
                return vec.tolist()
            # deterministic hash-based fallback (small, fast, no deps)
            return self._hash_embed(text)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        model = self._load()
        if self._is_flag:
            output = model.encode(texts, return_dense=True, return_sparse=False, return_colbert_vecs=False)
            return [vec.tolist() for vec in output["dense_vecs"]]
        else:
            if model is not None:
                vecs = model.encode(texts)
                return [v.tolist() for v in vecs]
            return [self._hash_embed(t) for t in texts]

    def _hash_embed(self, text: str, dim: int = 384) -> List[float]:
        import hashlib
        import random

        h = hashlib.sha256(text.encode("utf-8")).digest()
        seed = int.from_bytes(h, "big")
        rnd = random.Random(seed)
        return [rnd.random() for _ in range(dim)]


@lru_cache
def get_embedding_service() -> EmbeddingService:
    return EmbeddingService(model_name=settings.EMBEDDING_MODEL, device=settings.EMBEDDING_DEVICE)
