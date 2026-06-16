import httpx

question = 'ممكن افسخ عقد البيع لو لقيت عيب في حاجه'
r = httpx.post('http://localhost:8000/chat', 
    json={'question': question, 'stream': False}, 
    timeout=60
)

data = r.json()
print('=== Chat Response ===')
print('Answer:')
print(data['answer'][:800])
print()
print('Citations:')
for c in data['citations']:
    print(f"  - {c['law_name']} (Article {c['article_number']})")
