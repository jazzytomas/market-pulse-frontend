from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import json
from datetime import datetime

DB_PATH = "market_pulse.db"

app = FastAPI()

# CORS — aby React mohl komunikovat s backendem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        source TEXT,
        summary TEXT,
        risk_score INTEGER,
        weight TEXT,
        currency_impact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        event_time TEXT,
        impact TEXT,
        actual TEXT,
        forecast TEXT,
        previous TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()

init_db()

class ScenarioIn(BaseModel):
    title: str
    source: str = ""
    summary: str = ""
    risk_score: int = 0
    weight: str = "LOW"  # LOW / MED / HIGH
    currency_impact: dict = {}

@app.get("/api/health")
def health():
    return {"status": "ok", "time": str(datetime.now())}

@app.get("/api/scenarios")
def get_scenarios(limit: int = 20):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM scenarios ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "title": row[1],
            "source": row[2],
            "summary": row[3],
            "riskScore": row[4],          # frontend má riskScore
            "weight": row[5],
            "currencyImpact": json.loads(row[6]) if row[6] else {},
            "created_at": row[7],
        })
    return result

@app.post("/api/scenarios")
def add_scenario(s: ScenarioIn):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        "INSERT INTO scenarios (title, source, summary, risk_score, weight, currency_impact) VALUES (?,?,?,?,?,?)",
        (s.title, s.source, s.summary, int(s.risk_score), s.weight, json.dumps(s.currency_impact)),
    )
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    return {"ok": True, "id": new_id}

@app.get("/api/events")
def get_events(limit: int = 20):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM events ORDER BY event_time ASC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "date": row[2],      # frontend má "date"
            "impact": row[3],
            "actual": row[4],
            "forecast": row[5],
            "previous": row[6],
            "created_at": row[7],
        })
    return result

@app.get("/api/sentiment")
def get_sentiment():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT risk_score FROM scenarios ORDER BY created_at DESC LIMIT 10")
    rows = c.fetchall()
    conn.close()

    if not rows:
        return {"total_score": 0, "label": "NEUTRAL"}

    avg = sum(r[0] for r in rows if r[0] is not None) / len(rows)
    label = "RISK ON" if avg > 20 else "RISK OFF" if avg < -20 else "NEUTRAL"
    return {"total_score": round(avg), "label": label}
