from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=("../.env", ".env"), env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "DigitLaw"
    ENVIRONMENT: str = Field(default="development")
    DEBUG: bool = Field(default=False)
    API_V1_PREFIX: str = "/api/v1"
    LOG_LEVEL: str = Field(default="INFO")

    # CORS
    CORS_ORIGINS: List[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    # Qdrant
    QDRANT_URL: str = Field(default="http://localhost:6333")
    QDRANT_API_KEY: str | None = Field(default=None)
    QDRANT_COLLECTION: str = Field(default="egyptian_legal_articles")

    # Embeddings
    EMBEDDING_MODEL: str = Field(default="BAAI/bge-m3")
    EMBEDDING_DEVICE: str = Field(default="cpu")
    EMBEDDING_DIM: int = Field(default=1024)

    # Groq
    GROQ_API_KEY: str = Field(default="")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile")
    GROQ_TEMPERATURE: float = Field(default=0.1)
    GROQ_MAX_TOKENS: int = Field(default=2048)

    # OpenAI (Fallback)
    OPENAI_API_KEY: str = Field(default="")
    OPENAI_MODEL: str = Field(default="gpt-4o-mini")

    # Retrieval
    RETRIEVAL_TOP_K: int = Field(default=8)
    RETRIEVAL_SCORE_THRESHOLD: float = Field(default=0.20)
    RERANK_TOP_N: int = Field(default=5)

    # Guardrails
    HALLUCINATION_MIN_OVERLAP: float = Field(default=0.30)
    MAX_QUESTION_LENGTH: int = Field(default=1000)
    MAX_FILE_SIZE_MB: int = Field(default=15)

    # Redis (chat history / cache)
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # JWT / Auth
    SECRET_KEY: str = Field(default="change-me-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24)

    # File storage
    UPLOAD_DIR: str = Field(default="/data/uploads")


@lru_cache
def get_settings() -> Settings:
    return Settings()