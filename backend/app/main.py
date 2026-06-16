from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import chat, contract, system
from app.core.config import get_settings
from app.core.logging import configure_logging, get_logger
from app.middleware.request_context import RequestContextMiddleware

settings = get_settings()
configure_logging(settings.LOG_LEVEL)
logger = get_logger("digitlaw.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("application_startup", extra={"extra_fields": {"environment": settings.ENVIRONMENT}})
    yield
    logger.info("application_shutdown")


app = FastAPI(
    title="DigitLaw API",
    description="Egyptian Legal AI Assistant - RAG Chat & Contract Analysis",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "validation_error", "details": exc.errors()},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": "http_error", "detail": exc.detail})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled_exception")
    return JSONResponse(status_code=500, content={"error": "internal_server_error"})


app.include_router(system.router, prefix="")
app.include_router(chat.router, prefix="")
app.include_router(contract.router, prefix="")
