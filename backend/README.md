# ASTRA Crew Health Backend

FastAPI + SQLite backend for the ASTRA astronaut health-monitoring frontend.

## Start

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Main endpoints

- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/indicators`
- `GET /api/action-plan`
- `GET /api/crew`
- `PUT /api/crew`
- `POST /api/assessment`
- `GET /api/assessments`
- `GET /api/telemetry`
