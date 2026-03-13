# Backend (FastAPI + SQLite)

## Установка и запуск

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# создать/обновить таблицы и администратора, опционально — залить тестовые данные
python -m app.seed

# запуск API
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

- База данных: `SQLite` файл `backend/app.db` (в `.gitignore`).
- Swagger: http://127.0.0.1:8002/docs  
- Health-check: `GET /health`

Фронт по умолчанию ходит на порт **3000** — настройте прокси или переменную `API_BASE` на хост/порт, где слушает uvicorn.
