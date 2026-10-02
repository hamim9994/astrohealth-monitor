# ASTRA Crew Health Monitor — Full Stack

## Run the frontend
```powershell
npm install
npm run dev
```
Frontend: http://localhost:5173

## Run the backend
Open a second terminal:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

## Fixed interactive features
- Search bar with page/data search suggestions
- Working notification panel and mark-all-read control
- Crew profile dropdown and new-profile creation
- Dynamic time-based greeting
- Animated live health indicators and telemetry waves
- Mission selector and planetary-location selector
- Approximate Earth distance, surface gravity and health relevance for selected location
- Crew Setup save configuration connected to FastAPI/SQLite
- Profile persistence in SQLite

## API
- `GET /api/health`
- `GET /api/dashboard`
- `GET /api/indicators`
- `GET /api/action-plan`
- `GET /api/telemetry`
- `GET /api/crew`
- `PUT /api/crew`
- `GET /api/profiles`
- `POST /api/profiles`
- `PUT /api/profiles/{profile_id}`
- `POST /api/assessment`
- `GET /api/assessments`

The current telemetry and screening values are demonstration data. The API is structured so the next step can replace them with NASA/OSDR datasets and an ML model.
