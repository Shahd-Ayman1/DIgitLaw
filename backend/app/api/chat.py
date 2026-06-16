from __future__ import annotations

import uuid

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.core.logging import get_logger, request_id_ctx
from app.graphs.legal_assistant.nodes_domain import detect_domain_node
from app.graphs.legal_assistant.nodes_generation import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, build_context
from app.graphs.legal_assistant.nodes_retrieval import retrieve_node
from app.graphs.legal_assistant.nodes_verification import FALLBACK_NO_CONTEXT, FALLBACK_UNSAFE, _check_unsafe
from app.schemas.chat import ChatRequest, ChatResponse, LegalDomain
from app.services.llm_service import get_llm_service
from app.api.system import CHAT_LATENCY, FAITHFULNESS_GAUGE, FALLBACK_COUNT, REQUEST_COUNT

router = APIRouter(tags=["chat"])
logger = get_logger("digitlaw.api.chat")


@router.post("/chat", response_model=ChatResponse)
async def chat(request: Request, body: ChatRequest) -> ChatResponse:
    conversation_id = body.conversation_id or str(uuid.uuid4())
    request_id = request_id_ctx.get()

    state = {
        "question": body.question,
        "conversation_id": conversation_id,
        "request_id": request_id,
        "warnings": [],
    }

    with CHAT_LATENCY.time():
        # 1. Unsafe guardrail
        if _check_unsafe(state["question"]):
            FALLBACK_COUNT.inc()
            REQUEST_COUNT.labels(endpoint="/chat", status="success").inc()
            return ChatResponse(
                conversation_id=conversation_id,
                answer=FALLBACK_UNSAFE,
                citations=[],
                domain=LegalDomain.UNKNOWN,
                is_fallback=True,
                warnings=["unsafe_request_blocked"],
                request_id=request_id,
            )

        # 2. Domain & Retrieval
        state = detect_domain_node(state)
        state = retrieve_node(state)

        # 3. Empty retrieval guardrail
        if state.get("retrieval_empty"):
            FALLBACK_COUNT.inc()
            REQUEST_COUNT.labels(endpoint="/chat", status="success").inc()
            return ChatResponse(
                conversation_id=conversation_id,
                answer=FALLBACK_NO_CONTEXT,
                citations=[],
                domain=state.get("domain", LegalDomain.UNKNOWN),
                is_fallback=True,
                warnings=["empty_retrieval"],
                request_id=request_id,
            )

        # 4. Generate Answer
        context = build_context(state)
        user_prompt = USER_PROMPT_TEMPLATE.format(question=state["question"], context=context)
        llm = get_llm_service()
        answer = await llm.generate(SYSTEM_PROMPT, user_prompt)

    REQUEST_COUNT.labels(endpoint="/chat", status="success").inc()

    return ChatResponse(
        conversation_id=conversation_id,
        answer=answer,
        citations=state.get("citations", []),
        domain=state.get("domain", LegalDomain.UNKNOWN),
        is_fallback=False,
        warnings=state.get("warnings", []),
        request_id=request_id,
    )


@router.post("/chat/stream")
async def chat_stream(request: Request, body: ChatRequest):
    """Streaming variant: runs domain detection + retrieval, then streams
    the LLM answer token-by-token."""

    request_id = request_id_ctx.get()

    state = {
        "question": body.question,
        "conversation_id": body.conversation_id or str(uuid.uuid4()),
        "request_id": request_id,
        "warnings": [],
    }

    async def event_stream():
        import json as _json

        if _check_unsafe(state["question"]):
            yield _sse(
                {
                    "type": "error",
                    "message": FALLBACK_UNSAFE,
                }
            )
            return

        current_state = detect_domain_node(state)
        current_state = retrieve_node(current_state)

        if current_state.get("retrieval_empty"):
            yield _sse(
                {
                    "type": "error",
                    "message": FALLBACK_NO_CONTEXT,
                }
            )
            return

        context = build_context(current_state)

        user_prompt = USER_PROMPT_TEMPLATE.format(
            question=current_state["question"],
            context=context,
        )

        llm = get_llm_service()

        full_answer = ""

        async for token in llm.stream(
            SYSTEM_PROMPT,
            user_prompt,
        ):
            full_answer += token

            yield _sse(
                {
                    "type": "token",
                    "content": token,
                }
            )

        citations = [
            c.model_dump()
            for c in current_state.get("citations", [])
        ]

        yield _sse(
            {
                "type": "done",
                "final_answer": full_answer,
                "is_fallback": False,
                "citations": citations,
                "conversation_id": current_state["conversation_id"],
            }
        )

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )

def _sse(data: dict) -> str:
    import json

    return f"data: {json.dumps(data, ensure_ascii=False)}\n\n"

