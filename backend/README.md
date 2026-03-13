# Backend (FastAPI)

## Запуск

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

Проверка: http://127.0.0.1:8002/docs (Swagger)  
`GET /health` — проверка работы API.

Фронт по умолчанию ходит на порт **3000** — настройте прокси или переменную `API_BASE` на хост/порт, где слушает uvicorn.
