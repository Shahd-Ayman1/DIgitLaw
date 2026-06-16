import asyncio
from app.services.embedding_service import get_embedding_service
from app.services.retrieval_service import get_retrieval_service
from app.services.llm_service import get_llm_service
from app.graphs.legal_assistant.nodes_domain import detect_domain_node
from app.graphs.legal_assistant.nodes_generation import build_context, SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from app.core.logging import get_logger

logger = get_logger("test")

async def test_chat_flow():
    question = "ممكن افسخ عقد البيع لو لقيت عيب في حاجه"
    
    # Step 1: Domain detection
    state = {"question": question, "conversation_id": "test", "request_id": "test", "warnings": []}
    state = detect_domain_node(state)
    print("Domain:", state.get("domain"))
    
    # Step 2: Retrieval
    embedder = get_embedding_service()
    retriever = get_retrieval_service()
    vector = embedder.embed_query(question)
    print("Vector dimension:", len(vector))
    
    citations = retriever.search(
        query_vector=vector,
        category=state.get("category_filter"),
        law_type=state.get("law_type_filter"),
        top_k=8,
        score_threshold=0.45,
    )
    print("Citations count:", len(citations))
    state["citations"] = citations
    
    # Step 3: Build context and prompts
    context = build_context(state)
    print("Context length:", len(context))
    print("Context preview:", context[:100])
    
    user_prompt = USER_PROMPT_TEMPLATE.format(question=question, context=context)
    print("User prompt length:", len(user_prompt))
    print("User prompt preview:", user_prompt[:200])
    
    # Step 4: Generate answer
    llm = get_llm_service()
    print("\nLLM _groq_available:", llm._groq_available)
    print("LLM client:", llm.client is not None)
    
    print("\n=== Calling llm.generate ===")
    answer = await llm.generate(SYSTEM_PROMPT, user_prompt)
    print("Answer:", answer[:500])

asyncio.run(test_chat_flow())
