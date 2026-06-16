from __future__ import annotations

from functools import lru_cache
from typing import AsyncIterator, List, Optional

from groq import AsyncGroq
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("digitlaw.llm")
settings = get_settings()


class LLMService:
    def __init__(self, groq_api_key: str, model: str, temperature: float, max_tokens: int):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        self._groq_available = False
        self.groq_client = None
        
        self._openai_available = False
        self.openai_client = None

        # 1. Initialize Groq client
        if groq_api_key:
            try:
                self.groq_client = AsyncGroq(api_key=groq_api_key)
                self._groq_available = True
                logger.info("groq_client_initialized")
            except Exception as e:
                logger.warning("groq_initialization_failed", extra={"extra_fields": {"error": str(e)}})
        else:
            logger.warning("groq_api_key_not_set")

        # 2. Initialize OpenAI client (Fallback)
        if settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                self._openai_available = True
                logger.info("openai_client_initialized_for_fallback")
            except ImportError:
                logger.warning("openai_package_not_installed")
            except Exception as e:
                logger.warning("openai_initialization_failed", extra={"extra_fields": {"error": str(e)}})

    async def generate(self, system_prompt: str, user_prompt: str) -> str:
        # Try Groq First
        if self._groq_available:
            try:
                logger.info("calling_groq_generate", extra={"extra_fields": {"model": self.model}})
                response = await self.groq_client.chat.completions.create(
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                )
                result = response.choices[0].message.content or ""
                logger.info("groq_generate_success", extra={"extra_fields": {"response_len": len(result)}})
                return result
            except Exception as e:
                logger.error("groq_generation_failed", extra={"extra_fields": {"error": str(e), "error_type": type(e).__name__}})
                return await self._try_openai_fallback(system_prompt, user_prompt)
        
        # If Groq is completely unavailable, try OpenAI
        return await self._try_openai_fallback(system_prompt, user_prompt)

    async def _try_openai_fallback(self, system_prompt: str, user_prompt: str) -> str:
        if self._openai_available and self.openai_client:
            try:
                logger.info("calling_openai_fallback_generate", extra={"extra_fields": {"model": settings.OPENAI_MODEL}})
                response = await self.openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                )
                result = response.choices[0].message.content or ""
                logger.info("openai_fallback_success", extra={"extra_fields": {"response_len": len(result)}})
                return result
            except Exception as e:
                logger.error("openai_fallback_failed", extra={"extra_fields": {"error": str(e), "error_type": type(e).__name__}})
                return self._fallback_generate(user_prompt)
        
        logger.warning("no_fallback_available")
        return self._fallback_generate(user_prompt)

    def _fallback_generate(self, user_prompt: str) -> str:
        """Fallback response generation when both Groq and OpenAI are unavailable."""
        return (
            "أعتذر لحضرتك، أواجه حالياً عطل تقني يمنعني من معالجة سؤالك بشكل صحيح. "
            "يرجى المحاولة مرة أخرى بعد قليل، أو التواصل مع الدعم الفني إذا استمرت المشكلة."
        )

    async def stream(self, system_prompt: str, user_prompt: str) -> AsyncIterator[str]:
        # Try Groq First
        if self._groq_available:
            try:
                stream = await self.groq_client.chat.completions.create(
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    stream=True,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        yield delta
                return # Exit if successful
            except Exception as e:
                logger.error("groq_stream_failed", extra={"extra_fields": {"error": str(e)}})
                # Fallthrough to OpenAI
        
        # Try OpenAI Fallback
        if self._openai_available and self.openai_client:
            try:
                logger.info("calling_openai_fallback_stream", extra={"extra_fields": {"model": settings.OPENAI_MODEL}})
                stream = await self.openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    stream=True,
                )
                async for chunk in stream:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        yield delta
                return # Exit if successful
            except Exception as e:
                logger.error("openai_fallback_stream_failed", extra={"extra_fields": {"error": str(e)}})
                # Fallthrough to fallback message
        
        # Final fallback message
        yield self._fallback_generate(user_prompt)


@lru_cache
def get_llm_service() -> LLMService:
    return LLMService(
        groq_api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=settings.GROQ_TEMPERATURE,
        max_tokens=settings.GROQ_MAX_TOKENS,
    )