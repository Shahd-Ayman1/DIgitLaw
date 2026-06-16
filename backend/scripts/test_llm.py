import asyncio
from app.services.llm_service import get_llm_service
from app.core.config import get_settings

settings = get_settings()
print('=== Config Check ===')
print('Groq API Key:', settings.GROQ_API_KEY[:20] + '...')
print('Groq Model:', settings.GROQ_MODEL)

llm = get_llm_service()
print('\n=== LLM Service State ===')
print('_groq_available:', llm._groq_available)
print('client is None:', llm.client is None)

async def test():
    print('\n=== Testing Generate ===')
    result = await llm.generate(
        'أنت محامٍ قانوني مصري متخصص في القانون المدني',
        'ما هي حقوقي إذا وجدت عيب في البضاعة المشتراة؟'
    )
    print('Response:', result[:300] if len(result) > 300 else result)

try:
    asyncio.run(test())
except Exception as e:
    print('Error:', e)
    import traceback
    traceback.print_exc()
