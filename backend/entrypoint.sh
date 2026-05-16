#!/bin/bash
echo "Running database migrations..."
alembic upgrade head
echo "Seeding known devices..."
python  -m app.db.seed
echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000