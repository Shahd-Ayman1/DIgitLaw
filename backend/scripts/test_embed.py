from app.services.embedding_service import get_embedding_service
import traceback

try:
    svc = get_embedding_service()
    print('model loaded:', svc._model)
    print('is_flag:', svc._is_flag)
    v = svc.embed_query('اختبار')
    print('vector length', len(v))
except Exception:
    traceback.print_exc()
