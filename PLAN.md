# ASTRA — Crew Health Monitor
## AI Agent Project Plan & Context Contract

> **Purpose of this file:** This document is the single source of truth for any AI coding agent working on ASTRA.
> Read this file before changing code. Preserve existing behavior unless the task explicitly requires changing it.

---

## 1. PROJECT IDENTITY

**Project name:** ASTRA Crew Health Monitor

**Project type:** Full-stack astronaut health-monitoring / decision-support web application.

**Primary goal:**  
Build a modern mission-health dashboard that helps astronauts:
1. view their current health status,
2. inspect detailed health indicators,
3. complete a guided self-assessment,
4. receive a health action plan,
5. configure crew/mission settings,
6. understand mission/environment context.

The application is being prepared for the **NASA Space Apps Challenge 2026**.

### Core product idea

```text
NASA / mission data
        +
Astronaut self-reported data
        +
Telemetry / sensor data
        +
Mission + environmental context
        ↓
Data normalization / validation
        ↓
Health analytics / ML models
        ↓
FastAPI backend
        ↓
ASTRA Aurora Space UI
        ↓
Astronaut decision-support experience
```

ASTRA is **not a medical diagnosis system**. Any health result must be described as screening, monitoring, trend detection, or decision support. Concerning symptoms should direct the astronaut to the appropriate mission medical protocol.

---

# 2. CURRENT PRODUCT STATUS

The project currently contains:

- React + Vite frontend
- Tailwind CSS 4 styling
- Aurora Space visual system
- FastAPI backend
- SQLite demo database
- REST API
- Mission dashboard
- Health indicator page
- Guided self-assessment
- Action plan
- Crew setup
- Crew/profile management
- Search interaction
- Notification panel
- Mission/environment selector
- Animated telemetry visuals
- Dynamic time/greeting
- Persistent crew configuration

### Current implementation level

```text
UI/UX                  █████████░  ~90%
Frontend interactions   ████████░░  ~80%
Backend foundation      ███████░░░  ~70%
Real NASA data          ██░░░░░░░░  ~20%
ML health model         █░░░░░░░░░  ~10%
Production security     █░░░░░░░░░  ~10%
```

The percentages are project-planning estimates, not measured test coverage.

---

# 3. NON-NEGOTIABLE DESIGN DIRECTION

The approved visual direction is:

## Aurora Space

The interface should look like a futuristic spacecraft / mission-control health system.

### Visual characteristics

- Deep blue space background
- Cyan / teal primary accent
- Subtle violet/blue aurora glow
- Glassmorphism
- Thin luminous borders
- Soft shadows
- Holographic panels
- Space/planet imagery where appropriate
- Animated telemetry
- Minimal but information-dense layout
- High readability
- Responsive desktop/mobile behavior

### Reference style

The approved Mission Overview resembles:

- NASA mission-control interface
- futuristic spacecraft HUD
- medical telemetry console
- glass panels over Earth/space background
- cyan ECG signals
- circular readiness indicator
- astronaut health visualization
- compact status cards
- charts and mission telemetry

### Avoid

Do NOT turn the UI into:

- generic SaaS dashboard
- generic hospital dashboard
- overly dark black UI
- colorful gaming UI
- excessive gradients
- excessive animations
- cluttered cards
- fake medical certainty

---

# 4. FRONTEND INFORMATION ARCHITECTURE

Main navigation:

```text
ASTRA
│
├── Mission Overview
│
├── Health Indicators
│
├── Self Assessment
│
├── Action Plan
│
└── Crew Setup
```

Additional global UI:

```text
Top Bar
├── ASTRA logo
├── Global Search
├── Notification Bell
└── Crew Profile Selector

Sidebar
├── Navigation
├── Mission Card
└── Current Planet / Environment Card
```

---

# 5. MISSION OVERVIEW

## Purpose

Give the astronaut an immediate understanding of their current health and mission state.

### Required sections

1. Dynamic greeting
2. Current UTC/Earth time
3. Mission elapsed day
4. Health readiness score
5. Readiness ring
6. Live ECG/heartbeat
7. Current heart rate
8. Cardio status
9. SpO₂ status
10. Sleep recovery
11. Stress
12. Health trend chart
13. Quick health status
14. Today's highlights
15. Mission/environment card
16. Planet/location card

### Dynamic greeting

Greeting must be calculated from current local/browser time:

```text
05:00–11:59 → Good Morning
12:00–16:59 → Good Afternoon
17:00–20:59 → Good Evening
21:00–04:59 → Good Night
```

Do not hard-code "Good Morning".

The time displayed in the header should update automatically.

---

# 6. LIVE HEARTBEAT / ECG

The cardiovascular telemetry panel should look alive.

### Required behavior

- Animated ECG waveform
- Cyan glow
- Moving signal
- BPM indicator
- `LIVE` / `STREAMING` status
- Subtle pulse animation
- No excessive animation that hurts readability

### Data architecture

Initially:

```text
demo telemetry → frontend animation
```

Later:

```text
real telemetry → WebSocket/SSE → frontend
```

The visual animation must not be interpreted as real-time medical data unless it actually comes from a real sensor stream.

---

# 7. HEALTH INDICATORS

Health Indicators must NOT be a collection of static cards.

### Required indicators

At minimum:

```text
Cardiovascular
Blood Oxygen / SpO₂
Respiratory Rate
Body Temperature
Sleep Recovery
Stress Load
Hydration
Radiation Exposure
Musculoskeletal Status
```

### Each indicator should support

- Current value
- Unit
- Status
- Baseline
- Trend
- Recent history
- Data timestamp
- Data quality
- Animated telemetry
- Warning/review state

Example:

```text
HEART RATE

72 bpm
Optimal

Baseline: 60–80 bpm
Trend: stable
Last sync: 09:42 UTC

[animated ECG]
```

### Future

Indicators should come from backend:

```http
GET /api/indicators
```

not hard-coded frontend values.

---

# 8. GUIDED SELF ASSESSMENT

This is one of the most important product features.

The assessment gathers information that can help identify health changes during a mission.

## A. Mission / baseline

Collect:

- Age
- Sex / profile where appropriate
- Mission day
- Sleep duration
- Sleep quality

## B. Vital signs

Collect:

- Heart rate
- Systolic blood pressure
- Diastolic blood pressure
- SpO₂
- Temperature
- Respiratory rate

## C. Symptoms

Collect:

- Pain level
- Chest pain
- Breathing difficulty
- Dizziness/faintness
- Headache
- Nausea

## D. Cognitive / behavioral

Collect:

- Energy
- Mood
- Stress
- Focus
- Isolation

## E. Recovery / environment

Collect:

- Hydration
- Appetite
- Exercise minutes
- EVA exposure
- Radiation exposure

## F. Recent changes

Collect:

- Medication change
- Recent illness
- Unusual health change

---

# 9. SELF-ASSESSMENT RESULT

The backend returns:

```json
{
  "score": 82,
  "status": "MONITOR",
  "findings": [],
  "recommended_actions": [],
  "disclaimer": "..."
}
```

Possible status values:

```text
NOMINAL
MONITOR
MEDICAL REVIEW
URGENT REVIEW
```

These are workflow/status labels, not medical diagnoses.

### Result page must show

- Overall screening score
- Status
- Findings
- Severity
- Recommended actions
- Link to Action Plan
- Medical/decision-support disclaimer

---

# 10. ACTION PLAN

The Action Plan should convert detected issues into concrete next steps.

### Examples

```text
Hydration check
Recovery window
Resistance exercise
Radiation review
Repeat vital measurement
Crew support check-in
```

Each action should contain:

- Title
- Description
- Priority
- Timing
- Completion state

### Future

Actions should be generated from:

```text
assessment result
+
health indicators
+
mission context
+
ML risk output
```

rather than only hard-coded demo actions.

---

# 11. CREW SETUP

Crew Setup controls the astronaut's baseline and application preferences.

### Profile information

- Astronaut name
- Mission
- Mission day
- Mission duration
- Age

### Baseline configuration

- Resting HR range
- SpO₂ range
- Sleep target
- Exercise target
- Other health baselines

### Preferences

- Health alerts
- Medical data synchronization
- Quiet hours

### Save behavior

Save must persist to backend:

```http
PUT /api/crew
```

or profile-specific API when multi-crew support is enabled.

The UI should show:

```text
Saving...
Saved ✓
Save failed
```

Do not silently pretend that data was saved.

---

# 12. CREW PROFILES

The application supports multiple crew profiles.

Required functionality:

```text
Create profile
Select profile
Update profile
Persist profile
```

Future profile API:

```http
GET  /api/profiles
POST /api/profiles
GET  /api/profiles/{id}
PUT  /api/profiles/{id}
DELETE /api/profiles/{id}
```

Do not put sensitive medical data directly into localStorage as the final architecture.

---

# 13. GLOBAL SEARCH

Search must actually work.

Search targets should include:

```text
Pages
Health indicators
Crew members
Mission
Telemetry
Actions
Assessment
```

Example:

```text
"heart"
→ Cardiovascular
→ Heart rate indicator
→ ECG telemetry

"sleep"
→ Sleep recovery
→ Self assessment sleep
→ Sleep-related action

"crew"
→ Crew Setup
→ Crew profiles
```

Search results should navigate to the relevant UI section.

Future version may use backend search:

```http
GET /api/search?q=heart
```

---

# 14. NOTIFICATION SYSTEM

Notification bell must open a functional panel.

Notification types:

```text
Health alert
Telemetry update
Assessment reminder
Mission event
Action reminder
System notification
```

Each notification:

```json
{
  "id": "...",
  "type": "health",
  "title": "...",
  "message": "...",
  "severity": "info|warning|urgent",
  "read": false,
  "created_at": "..."
}
```

Required actions:

- Open panel
- Mark notification read
- Mark all read
- Unread count
- Severity indicator

Future API:

```http
GET  /api/notifications
PUT  /api/notifications/{id}/read
POST /api/notifications/read-all
```

---

# 15. MISSION SELECTOR

Mission card must be interactive.

Example missions:

```text
Artemis-1
Artemis-2
ISS Expedition
Lunar Gateway
Mars Transit
Mars Surface
```

Mission data should contain:

```json
{
  "id": "mars-transit",
  "name": "Mars Transit",
  "duration_days": 210,
  "description": "...",
  "environment": "deep-space"
}
```

Future API:

```http
GET /api/missions
GET /api/missions/{id}
```

Mission selection must update:

- mission name
- mission day
- duration
- progress
- environment context
- health considerations

---

# 16. PLANET / ENVIRONMENT SELECTOR

The current "Earth" card is not just decorative.

The astronaut should be able to select the current environment/body.

Possible bodies:

```text
Earth
Moon
Mars
Venus
Mercury
```

Display:

- Planet/body name
- Distance
- Surface gravity
- Relative gravity
- Environment classification
- Health relevance

Example:

```text
Mars

Distance:
~225 million km

Gravity:
0.378 g

Health relevance:
Reduced gravity may affect
musculoskeletal and cardiovascular
adaptation during prolonged exposure.
```

### Important

Distances change based on orbital position.

For a production system, do not permanently hard-code one distance.

Use a space/ephemeris data source or NASA-supported data.

---

# 17. GRAVITY / ENVIRONMENT HEALTH LOGIC

The application may use environmental information as a contextual factor.

Example:

```text
Earth → 1.0 g
Moon  → 0.165 g
Mars  → 0.378 g
```

Potential health areas affected by reduced gravity:

```text
Musculoskeletal
Cardiovascular
Sensorimotor
Fluid redistribution
Exercise requirements
```

Do not state that a specific gravity level will definitely cause disease.

Use wording such as:

```text
"May affect"
"Associated with"
"Health monitoring consideration"
```

---

# 18. BACKEND ARCHITECTURE

Current backend:

```text
FastAPI
   │
   ├── Routes
   │
   ├── Pydantic schemas
   │
   ├── Health assessment service
   │
   └── SQLite
```

Recommended future structure:

```text
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── dashboard.py
│   │   ├── indicators.py
│   │   ├── assessment.py
│   │   ├── crew.py
│   │   ├── missions.py
│   │   ├── notifications.py
│   │   └── telemetry.py
│   │
│   ├── models/
│   │   ├── crew.py
│   │   ├── assessment.py
│   │   ├── telemetry.py
│   │   └── mission.py
│   │
│   ├── schemas/
│   │
│   ├── services/
│   │   ├── assessment_service.py
│   │   ├── health_service.py
│   │   ├── mission_service.py
│   │   └── notification_service.py
│   │
│   ├── ml/
│   │   ├── preprocessing.py
│   │   ├── inference.py
│   │   └── models/
│   │
│   ├── database/
│   │
│   └── config.py
│
├── requirements.txt
└── .env
```

Do not perform a huge restructure unless it provides a clear benefit.

---

# 19. CURRENT API CONTRACT

Current important endpoints:

```http
GET /api/health
GET /api/dashboard
GET /api/indicators
GET /api/action-plan
GET /api/crew
PUT /api/crew
GET /api/telemetry
POST /api/assessment
GET /api/assessments
```

Frontend API helper:

```text
src/api.js
```

Default API URL:

```text
http://localhost:8000/api
```

Environment variable:

```text
VITE_API_URL
```

---

# 20. DATABASE

Current development database:

```text
SQLite
```

Current conceptual tables:

```text
crew
assessments
telemetry
```

Future tables:

```text
crew_profiles
missions
telemetry
health_indicators
assessments
assessment_findings
action_items
notifications
environment_states
radiation_measurements
model_predictions
```

For production, consider PostgreSQL.

---

# 21. ASTRONAUT HEALTH DATA STRATEGY

Do NOT search for one perfect CSV.

ASTRA should use multiple sources.

Recommended data categories:

```text
NASA Standard Measures
        +
NASA OSDR
        +
NASA Life Sciences / Human Research
        +
Analog mission datasets
        +
Space/environment datasets
        +
Astronaut self-assessment
        ↓
Unified ASTRA dataset
```

Important candidate sources include NASA:

- Spaceflight Standard Measures
- Open Science Data Repository (OSDR)
- Life Sciences Portal
- Human Research Program datasets
- Inspiration4 datasets
- Analog mission datasets

---

# 22. DATA PIPELINE

Future pipeline:

```text
RAW DATA
   ↓
Download
   ↓
Validate
   ↓
Normalize units
   ↓
Handle missing values
   ↓
Align timestamps
   ↓
Map astronaut/mission IDs
   ↓
Feature engineering
   ↓
Unified dataset
   ↓
Train/validation/test split
   ↓
ML model
```

Never mix training and test records from the same temporal episode in a way that causes leakage.

For astronaut/mission data, temporal and subject-level leakage is a major concern.

---

# 23. EXPECTED ML FEATURES

Potential feature groups:

### Cardiovascular

```text
heart_rate
heart_rate_variability
blood_pressure
activity
sleep_duration
mission_day
gravity_environment
```

### Respiratory

```text
spo2
respiratory_rate
activity
sleep
mission_day
```

### Sleep / behavioral

```text
sleep_duration
sleep_quality
stress
mood
focus
cognition
isolation
mission_day
```

### Musculoskeletal

```text
exercise_minutes
exercise_frequency
mission_duration
gravity
strength measurements
body composition
```

### Radiation

```text
cumulative_radiation
daily_radiation
EVA_hours
mission_day
solar/environment data
```

---

# 24. ML MODEL STRATEGY

Do not start with a complex deep-learning model immediately.

Start with explainable baselines:

```text
Logistic Regression
Random Forest
XGBoost / LightGBM if appropriate
```

Then compare with more complex models if data size supports it.

For continuous outcomes:

```text
Linear Regression
Random Forest Regressor
Gradient Boosting
```

For time-series telemetry:

```text
Feature-based time windows
LSTM/GRU
Temporal CNN
Transformer
```

Only use deep learning when there is enough data.

---

# 25. MODEL OUTPUT

The model should preferably output:

```json
{
  "risk_score": 0.27,
  "confidence": 0.81,
  "category": "monitor",
  "factors": [
    {
      "feature": "sleep_recovery",
      "direction": "negative",
      "contribution": 0.14
    }
  ]
}
```

The frontend can convert this into:

```text
Health signal
Monitor
```

rather than saying:

```text
"You have disease X"
```

---

# 26. HEALTH SCORE

The current readiness score is a demo.

Future health readiness should be based on documented features and model outputs.

Possible conceptual structure:

```text
Readiness
├── Cardiovascular
├── Respiratory
├── Sleep/Recovery
├── Behavioral
├── Musculoskeletal
├── Hydration
├── Radiation context
└── Recent changes
```

Each component should have:

```text
value
baseline
trend
confidence
data quality
```

Do not create arbitrary weights and present them as scientifically validated.

---

# 27. DATA QUALITY

Every health measurement should ideally carry:

```text
timestamp
source
unit
quality
missing flag
```

Example:

```json
{
  "value": 72,
  "unit": "bpm",
  "timestamp": "...",
  "source": "wearable",
  "quality": 0.97
}
```

The UI should distinguish:

```text
LIVE
RECENT
STALE
MISSING
SIMULATED
```

This is especially important for a space-health system.

---

# 28. SECURITY / PRIVACY

Health data is sensitive.

Future implementation should include:

- Authentication
- Role-based access
- Encryption in transit
- Secure secret storage
- Audit logs
- Minimum necessary data
- No health data in URL parameters
- No API keys in frontend
- No real patient/astronaut PII in Git
- `.env` excluded from Git
- Database backups handled securely

---

# 29. ERROR HANDLING

Every API request must handle:

```text
Loading
Success
Empty
Error
Offline
```

Example:

```text
Loading telemetry...

Telemetry unavailable
Retry
```

Never leave the page completely blank after an API failure.

Use error boundaries for React.

---

# 30. RESPONSIVE DESIGN

The application must work on:

```text
Desktop
Laptop
Tablet
Mobile
```

Desktop is the primary target.

At smaller widths:

```text
Sidebar → collapsible navigation
3/4 column grids → 1 column
Charts → horizontally scrollable or resized
Mission/environment cards → stacked
```

---

# 31. ANIMATION RULES

Animations should communicate system state.

Good:

```text
ECG pulse
Live indicator
Telemetry scan
Chart drawing
Readiness ring
Notification arrival
Planet transition
```

Avoid:

```text
constant excessive bouncing
large page movement
slow navigation transitions
animations that block interaction
```

Respect `prefers-reduced-motion`.

---

# 32. FRONTEND STATE

Use a centralized state strategy as complexity increases.

Possible state:

```text
currentCrew
currentMission
currentEnvironment
dashboard
indicators
notifications
assessment
actionPlan
```

For small state, React state/context is acceptable.

If state becomes difficult to manage, consider Zustand.

Do not introduce Redux unless necessary.

---

# 33. DEVELOPMENT RULES FOR AI AGENTS

Before changing code:

1. Read this `PLAN.md`.
2. Inspect the current file structure.
3. Inspect the existing component before replacing it.
4. Preserve working features.
5. Avoid duplicating components.
6. Do not silently remove API behavior.
7. Do not replace working pages with placeholders.
8. Keep frontend/backend API contracts synchronized.
9. Test affected functionality.
10. Update this plan when architecture changes.

---

# 34. AI AGENT CHANGE PROTOCOL

Every coding agent should report:

```text
WHAT I CHANGED
WHY I CHANGED IT
FILES CHANGED
API CHANGES
DATABASE CHANGES
UI CHANGES
TESTS RUN
KNOWN LIMITATIONS
NEXT RECOMMENDED STEP
```

Example:

```text
WHAT I CHANGED
Connected Crew Setup to PUT /api/crew.

FILES
frontend/src/pages/CrewSetup.jsx
frontend/src/api.js
backend/app/api/crew.py

API
PUT /api/crew

TEST
Updated crew configuration and verified persistence.

LIMITATION
Authentication is not implemented yet.
```

---

# 35. CURRENT PRIORITY ROADMAP

## Phase 1 — UI stability

- [x] Aurora Space theme
- [x] Mission Overview
- [x] Health Indicators
- [x] Self Assessment
- [x] Action Plan
- [x] Crew Setup
- [x] Dynamic greeting
- [x] Search
- [x] Notifications
- [x] Crew profile interaction
- [x] Mission selector
- [x] Planet/environment selector
- [x] Animated health telemetry

## Phase 2 — Backend

- [x] FastAPI
- [x] SQLite
- [x] Dashboard API
- [x] Indicator API
- [x] Assessment API
- [x] Crew API
- [x] Telemetry API
- [x] Action Plan API

## Phase 3 — Real data

- [ ] Identify NASA datasets
- [ ] Download source datasets
- [ ] Document licensing/access
- [ ] Build ingestion scripts
- [ ] Normalize units
- [ ] Build unified schema
- [ ] Create data dictionary
- [ ] Handle missing values
- [ ] Create training dataset

## Phase 4 — ML

- [ ] Define prediction target
- [ ] Build baseline model
- [ ] Train/test split
- [ ] Prevent subject leakage
- [ ] Evaluate model
- [ ] Explain model outputs
- [ ] Save model artifact
- [ ] Build inference service
- [ ] Connect inference to FastAPI

## Phase 5 — Live telemetry

- [ ] WebSocket/SSE
- [ ] Streaming heart rate
- [ ] Streaming SpO₂
- [ ] Streaming temperature
- [ ] Streaming respiratory data
- [ ] Data-quality indicators
- [ ] Stale-data detection

## Phase 6 — Mission intelligence

- [ ] NASA mission data
- [ ] Planetary distance
- [ ] Gravity
- [ ] Radiation environment
- [ ] Space weather
- [ ] Mission timeline
- [ ] Environment-health context

## Phase 7 — Production quality

- [ ] Authentication
- [ ] Role-based access
- [ ] Secure storage
- [ ] PostgreSQL
- [ ] API tests
- [ ] Frontend tests
- [ ] ML monitoring
- [ ] Deployment
- [ ] Documentation

---

# 36. IMMEDIATE NEXT TASK

The next major technical task is:

## Build the real NASA data pipeline.

Do NOT immediately train a model.

First:

```text
1. Find NASA datasets
2. Inspect schemas
3. Download relevant files
4. Identify available health variables
5. Identify mission/subject/time dimensions
6. Map variables to ASTRA categories
7. Determine what can actually be predicted
8. Build unified dataset
9. Then select the ML target
```

The model must be driven by what the data actually contains.

---

# 37. IMPORTANT PROJECT PRINCIPLE

ASTRA should never pretend that a demo value is real.

Use explicit labels:

```text
SIMULATED
DEMO
ESTIMATED
NASA DATA
LIVE
SELF-REPORTED
MODEL OUTPUT
```

Example:

```text
72 bpm
LIVE
```

should only be displayed if it is actually live.

For demo mode:

```text
72 bpm
SIMULATED TELEMETRY
```

This distinction is critical for credibility.

---

# 38. FINAL PRODUCT VISION

The finished ASTRA system should feel like:

```text
                 ASTRA
                   │
          Crew Health Monitor
                   │
     ┌─────────────┼─────────────┐
     ↓             ↓             ↓
  TELEMETRY     SELF REPORT    MISSION DATA
     │             │             │
     └─────────────┼─────────────┘
                   ↓
              DATA ENGINE
                   ↓
             HEALTH MODELS
                   ↓
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    STATUS       TRENDS      RISKS
       │           │           │
       └───────────┼───────────┘
                   ↓
             ACTION PLAN
                   ↓
             ASTRONAUT
```

The astronaut should be able to answer three questions quickly:

### 1. "How am I doing?"
Mission Overview.

### 2. "What is changing?"
Health Indicators + Trends.

### 3. "What should I do?"
Self Assessment + Action Plan.

That is the core ASTRA experience.

---

# 39. AGENT HANDOFF CHECKLIST

Before an AI agent finishes a task, verify:

- [ ] Existing UI still works
- [ ] Navigation still works
- [ ] API still starts
- [ ] No secrets committed
- [ ] No fake medical claims added
- [ ] No important functionality removed
- [ ] Loading state exists
- [ ] Error state exists
- [ ] Mobile layout remains usable
- [ ] New API endpoint documented
- [ ] Database change documented
- [ ] PLAN.md updated if architecture changed

---

# 40. ONE-SENTENCE CONTEXT FOR A NEW AI AGENT

> **ASTRA is a React/Vite + Tailwind 4 + FastAPI astronaut health decision-support system with an Aurora Space mission-control UI; it currently uses demo/SQLite data, and the next major objective is to integrate real NASA human-spaceflight datasets, build a defensible ML health-risk pipeline, and connect its outputs to the existing Mission Overview, Health Indicators, Self Assessment, Action Plan, Crew Setup, mission, environment, search, notification, and telemetry systems.**

---

## END OF PLAN
