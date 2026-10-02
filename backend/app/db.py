
import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "astra_health.db"))

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()

def init_db():
    with get_db() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS crew (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            mission TEXT NOT NULL,
            mission_day INTEGER NOT NULL,
            mission_duration INTEGER NOT NULL,
            age INTEGER,
            resting_hr_min INTEGER,
            resting_hr_max INTEGER,
            spo2_min REAL,
            spo2_max REAL,
            sleep_min REAL,
            sleep_max REAL,
            exercise_min INTEGER,
            alerts_enabled INTEGER DEFAULT 1,
            medical_sync_enabled INTEGER DEFAULT 1,
            quiet_hours_enabled INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mission TEXT NOT NULL,
            mission_day INTEGER NOT NULL,
            mission_duration INTEGER NOT NULL,
            age INTEGER NOT NULL,
            resting_hr_min INTEGER DEFAULT 60,
            resting_hr_max INTEGER DEFAULT 80,
            spo2_min REAL DEFAULT 95,
            spo2_max REAL DEFAULT 100,
            sleep_min REAL DEFAULT 7,
            sleep_max REAL DEFAULT 9,
            exercise_min INTEGER DEFAULT 30,
            alerts_enabled INTEGER DEFAULT 1,
            medical_sync_enabled INTEGER DEFAULT 1,
            quiet_hours_enabled INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL,
            score INTEGER NOT NULL,
            status TEXT NOT NULL,
            payload TEXT NOT NULL,
            findings TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recorded_at TEXT NOT NULL,
            heart_rate REAL,
            spo2 REAL,
            temperature REAL,
            respiratory_rate REAL,
            stress REAL,
            hydration REAL,
            sleep_recovery REAL,
            radiation REAL,
            musculoskeletal REAL
        );
        """)

        profile_count = db.execute("SELECT COUNT(*) AS c FROM profiles").fetchone()["c"]
        if profile_count == 0:
            db.execute("""
            INSERT INTO profiles(name,mission,mission_day,mission_duration,age)
            VALUES('Cmdr. Alex Chen','Artemis-1',142,180,38)
            """)

        existing = db.execute("SELECT id FROM crew WHERE id=1").fetchone()
        if not existing:
            db.execute("""
            INSERT INTO crew
            (id,name,mission,mission_day,mission_duration,age,resting_hr_min,resting_hr_max,
             spo2_min,spo2_max,sleep_min,sleep_max,exercise_min,alerts_enabled,
             medical_sync_enabled,quiet_hours_enabled)
            VALUES (1,'Cmdr. Alex Chen','Artemis-1',142,180,38,60,80,95,100,7,9,30,1,1,1)
            """)

        count = db.execute("SELECT COUNT(*) AS c FROM telemetry").fetchone()["c"]
        if count == 0:
            rows = [
                ("2026-09-24T12:00:00Z",74,98,36.7,16,34,82,84,38,88),
                ("2026-09-25T12:00:00Z",78,98,36.8,16,37,79,80,39,86),
                ("2026-09-26T12:00:00Z",76,97,36.8,17,35,81,82,40,87),
                ("2026-09-27T12:00:00Z",73,98,36.7,16,32,83,85,41,89),
                ("2026-09-28T12:00:00Z",72,98,36.8,16,31,78,84,42,88),
                ("2026-09-29T12:00:00Z",71,99,36.7,15,29,80,86,42,90),
                ("2026-09-30T12:00:00Z",72,98,36.8,16,31,78,84,42,88),
            ]
            db.executemany("""
            INSERT INTO telemetry
            (recorded_at,heart_rate,spo2,temperature,respiratory_rate,stress,
             hydration,sleep_recovery,radiation,musculoskeletal)
            VALUES (?,?,?,?,?,?,?,?,?,?)
            """, rows)
