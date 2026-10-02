
import json
from datetime import datetime, timezone
from pathlib import Path
import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .db import get_db, init_db
from .schemas import AssessmentInput, AssessmentResult, CrewUpdate, ProfileCreate
from .services import assess

app = FastAPI(
    title="ASTRA Crew Health API",
    version="1.0.0",
    description="Decision-support backend for astronaut mission health monitoring."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://astrohealth-monitor-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ASTRA Crew Health API"}


@app.get("/api/profiles")
def profiles():
    with get_db() as db:
        rows = db.execute("SELECT * FROM profiles ORDER BY id").fetchall()
    return [dict(r) for r in rows]

@app.post("/api/profiles")
def create_profile(payload: ProfileCreate):
    with get_db() as db:
        cur = db.execute("""
            INSERT INTO profiles(name,mission,mission_day,mission_duration,age)
            VALUES(?,?,?,?,?)
        """, (payload.name,payload.mission,payload.mission_day,payload.mission_duration,payload.age))
        profile_id = cur.lastrowid
        db.execute("""
            UPDATE crew SET name=?, mission=?, mission_day=?, mission_duration=?, age=? WHERE id=1
        """, (payload.name,payload.mission,payload.mission_day,payload.mission_duration,payload.age))
        row = db.execute("SELECT * FROM profiles WHERE id=?", (profile_id,)).fetchone()
    return dict(row)


@app.put("/api/profiles/{profile_id}")
def update_profile(profile_id: int, payload: CrewUpdate):
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        with get_db() as db:
            row = db.execute("SELECT * FROM profiles WHERE id=?", (profile_id,)).fetchone()
        if not row:
            raise HTTPException(404, "Profile not found")
        return dict(row)
    allowed = {"name","mission","mission_day","mission_duration","age","alerts_enabled","medical_sync_enabled","quiet_hours_enabled"}
    updates = {k:v for k,v in updates.items() if k in allowed}
    if not updates:
        raise HTTPException(400, "No editable profile fields supplied")
    fields=[]; values=[]
    for key,value in updates.items():
        fields.append(f"{key}=?"); values.append(int(value) if isinstance(value,bool) else value)
    values.append(profile_id)
    with get_db() as db:
        cur=db.execute(f"UPDATE profiles SET {', '.join(fields)} WHERE id=?", values)
        if cur.rowcount == 0: raise HTTPException(404, "Profile not found")
        row=db.execute("SELECT * FROM profiles WHERE id=?", (profile_id,)).fetchone()
    return dict(row)

@app.get("/api/crew")
def get_crew():
    with get_db() as db:
        row = db.execute("SELECT * FROM crew WHERE id=1").fetchone()
    return dict(row)

@app.put("/api/crew")
def update_crew(payload: CrewUpdate):
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        return get_crew()
    fields = []
    values = []
    for key, value in updates.items():
        fields.append(f"{key} = ?")
        values.append(int(value) if isinstance(value, bool) else value)
    values.append(1)
    with get_db() as db:
        db.execute(f"UPDATE crew SET {', '.join(fields)} WHERE id=?", values)
    return get_crew()

@app.get("/api/telemetry")
def telemetry():
    with get_db() as db:
        rows = db.execute("""
            SELECT recorded_at, heart_rate, spo2, temperature, respiratory_rate,
                   stress, hydration, sleep_recovery, radiation, musculoskeletal
            FROM telemetry ORDER BY recorded_at ASC
        """).fetchall()
    return [dict(r) for r in rows]

@app.get("/api/indicators")
def indicators():
    with get_db() as db:
        row = db.execute("""
            SELECT * FROM telemetry ORDER BY recorded_at DESC LIMIT 1
        """).fetchone()
    if not row:
        raise HTTPException(404, "No telemetry available")
    r = dict(row)
    return [
        {"name":"Cardiovascular","value":r["heart_rate"],"unit":"bpm","status":"Optimal" if 60<=r["heart_rate"]<=80 else "Review","score":72},
        {"name":"Blood Oxygen","value":r["spo2"],"unit":"%","status":"Nominal" if r["spo2"]>=95 else "Review","score":r["spo2"]},
        {"name":"Respiratory Rate","value":r["respiratory_rate"],"unit":"rpm","status":"Normal" if 12<=r["respiratory_rate"]<=20 else "Review","score":82},
        {"name":"Body Temperature","value":r["temperature"],"unit":"°C","status":"Normal" if 36.2<=r["temperature"]<=37.4 else "Review","score":76},
        {"name":"Sleep Recovery","value":r["sleep_recovery"],"unit":"%","status":"Good" if r["sleep_recovery"]>=80 else "Review","score":r["sleep_recovery"]},
        {"name":"Stress Load","value":r["stress"],"unit":"/100","status":"Low" if r["stress"]<50 else "Review","score":100-r["stress"]},
        {"name":"Hydration","value":r["hydration"],"unit":"%","status":"Good" if r["hydration"]>=75 else "Review","score":r["hydration"]},
        {"name":"Radiation Exposure","value":r["radiation"],"unit":"mSv","status":"Within limit","score":42},
        {"name":"Musculoskeletal","value":r["musculoskeletal"],"unit":"%","status":"Stable" if r["musculoskeletal"]>=80 else "Review","score":r["musculoskeletal"]},
    ]

@app.get("/api/action-plan")
def action_plan():
    with get_db() as db:
        latest = db.execute("SELECT * FROM telemetry ORDER BY recorded_at DESC LIMIT 1").fetchone()
    r = dict(latest) if latest else {}
    actions = []
    if r.get("hydration", 100) < 80:
        actions.append({"title":"Hydration check","description":"Increase approved fluid intake and reassess hydration.","priority":"HIGH","timing":"Next rest period"})
    if r.get("sleep_recovery", 100) < 80:
        actions.append({"title":"Recovery window","description":"Protect the next sleep opportunity and reduce non-essential workload.","priority":"MEDIUM","timing":"Tonight"})
    actions.append({"title":"Resistance exercise","description":"Complete the planned resistance session if no pain or unusual fatigue is present.","priority":"MEDIUM","timing":"30 min"})
    actions.append({"title":"Radiation review","description":"Review cumulative dosimeter exposure after the next sync.","priority":"LOW","timing":"Next sync"})
    return actions

@app.get("/api/dashboard")
def dashboard():
    with get_db() as db:
        latest = db.execute("SELECT * FROM telemetry ORDER BY recorded_at DESC LIMIT 1").fetchone()
        crew = db.execute("SELECT * FROM crew WHERE id=1").fetchone()
    r = dict(latest)
    readiness = round(
        max(0, min(100,
            0.25 * (100 - abs(r["heart_rate"] - 72) * 2) +
            0.20 * r["spo2"] +
            0.20 * r["sleep_recovery"] +
            0.15 * (100 - r["stress"]) +
            0.10 * r["hydration"] +
            0.10 * r["musculoskeletal"]
        ))
    )
    return {
        "crew": dict(crew),
        "readiness": readiness,
        "status": "SYSTEM NOMINAL" if readiness >= 75 else "MONITOR",
        "latest": r,
        "last_sync": r["recorded_at"]
    }

@app.post("/api/assessment", response_model=AssessmentResult)
def submit_assessment(payload: AssessmentInput):
    result = assess(payload.model_dump())
    now = datetime.now(timezone.utc).isoformat()
    with get_db() as db:
        db.execute(
            "INSERT INTO assessments(created_at,score,status,payload,findings) VALUES(?,?,?,?,?)",
            (now, result["score"], result["status"], json.dumps(payload.model_dump()), json.dumps(result))
        )
    return result

@app.get("/api/assessments")
def assessment_history():
    with get_db() as db:
        rows = db.execute(
            "SELECT id,created_at,score,status,findings FROM assessments ORDER BY id DESC LIMIT 20"
        ).fetchall()
    result = []
    for row in rows:
        item = dict(row)
        item["findings"] = json.loads(item["findings"])
        result.append(item)
    return result
