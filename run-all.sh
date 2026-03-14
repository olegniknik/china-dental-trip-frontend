#!/usr/bin/env bash
# Запуск бэкенда и фронтенда одной командой (в фоне).
# Бэкенд: http://127.0.0.1:8002  Фронт: http://localhost:5173

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# Бэкенд
if ! command -v uvicorn &>/dev/null; then
  (cd backend && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8002) &
else
  (cd backend && .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8002) &
fi
BACKEND_PID=$!

# Фронт
npm run dev &
FRONT_PID=$!

echo "Backend PID: $BACKEND_PID  Frontend PID: $FRONT_PID"
echo "Backend: http://127.0.0.1:8002  Docs: http://127.0.0.1:8002/docs"
echo "Frontend: http://localhost:5173"
echo "Чтобы остановить: kill $BACKEND_PID $FRONT_PID"

wait
