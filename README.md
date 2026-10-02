# ASTRA Crew Health Monitor

ASTRA is a mission-health dashboard and decision-support application for astronauts and crew operations teams. It combines a futuristic space-themed UI with a lightweight backend to simulate live health monitoring, crew profile management, and guided self-assessment for a spacecraft mission context.

The project is designed as a concept prototype for the NASA Space Apps Challenge 2026, with a focus on astronaut well-being, trend monitoring, and operational decision support.

## What the project does

ASTRA helps users:

- view a live-ready mission overview with dynamic greeting, mission day, and health readiness score
- inspect detailed health indicators such as heart rate, SpO₂, sleep recovery, hydration, stress, and radiation exposure
- complete a guided self-assessment for symptoms and mission conditions
- receive a personalized action plan based on the current health snapshot
- manage crew profiles and mission settings through a setup interface
- persist mission data using a SQLite-backed FastAPI backend

This application is intended for operational decision support and screening, not medical diagnosis. Any health result should be treated as a monitoring or screening signal that may require follow-up with the appropriate mission medical protocol.

## Main features

- React + Vite frontend with a space-inspired Aurora UI
- Tailwind CSS styling for glassmorphism panels and telemetry visuals
- FastAPI backend with SQLite database
- Crew profile creation and updates
- Health dashboard and trend visualization
- Guided assessment form that calculates screening findings
- Personalized mission action recommendations
- Animated ECG and health telemetry panels

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, SQLite, Pydantic
- Data model: mission telemetry, crew profile data, and assessment histories

## Project structure

```text
astrohealth-monitor/
├── backend/
│   ├── app/
│   ├── astra_health.db
│   ├── requirements.txt
│   └── README.md
├── src/
├── .env.example
├── index.html
├── package.json
├── PLAN.md
├── README.md
├── start-backend.bat
├── start-frontend.bat
├── vite.config.js
└── LICENSE
```

## How to run the app

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm

### 1) Start the frontend

From the project root:

```powershell
npm install
npm run dev
```

Then open:

- http://localhost:5173

### 2) Start the backend

Open a second terminal and run:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then open:

- http://localhost:8000/docs

### Quick start scripts

On Windows, you can also use the bundled scripts:

```powershell
start-frontend.bat
start-backend.bat
```

## Environment configuration

The app expects the frontend to reach the backend on the local API URL. The example environment file is:

```env
VITE_API_URL=http://localhost:8000/api
```

## Backend API overview

The FastAPI backend provides endpoints such as:

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

## Screens included

- Mission Overview
- Health Indicators
- Guided Self Assessment
- Health Action Plan
- Crew Setup

## Important note

ASTRA is a prototype concept built for mission simulation and research exploration. The current data is demo telemetry and simple rule-based screening logic, not a clinically validated medical system. It is meant to demonstrate how a crew health dashboard could support astronaut monitoring and decision support during a mission.

## License

This project is distributed under the MIT license. See the LICENSE file for details.
