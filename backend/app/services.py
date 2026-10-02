
from typing import Any

def clamp(value, low, high):
    return max(low, min(high, value))

def assess(data: dict[str, Any]) -> dict[str, Any]:
    score = 100
    findings = []
    actions = []

    def flag(severity, title, detail, penalty=0, action=None):
        nonlocal score
        score -= penalty
        findings.append({"severity": severity, "title": title, "detail": detail})
        if action:
            actions.append(action)

    if data["spo2"] < 94:
        flag("urgent", "Low oxygen saturation", f"SpO₂ reported at {data['spo2']}%.", 25,
             "Stop strenuous activity and follow mission medical protocol.")
    elif data["spo2"] < 96:
        flag("review", "Oxygen saturation below baseline", f"SpO₂ reported at {data['spo2']}%.", 8,
             "Repeat the measurement and compare with the crew baseline.")

    if data["heart_rate"] < 50 or data["heart_rate"] > 100:
        flag("review", "Heart rate outside configured screening range",
             f"Heart rate reported at {data['heart_rate']} bpm.", 10,
             "Repeat the reading at rest and review with mission medical support if persistent.")

    if data.get("systolic_bp") is not None:
        sbp, dbp = data["systolic_bp"], data.get("diastolic_bp")
        if sbp >= 180 or (dbp is not None and dbp >= 120):
            flag("urgent", "Severely elevated blood pressure",
                 f"Reported BP is {sbp}/{dbp} mmHg.", 30,
                 "Follow mission medical emergency procedures.")
        elif sbp >= 140 or (dbp is not None and dbp >= 90):
            flag("review", "Elevated blood pressure",
                 f"Reported BP is {sbp}/{dbp} mmHg.", 8,
                 "Repeat after seated rest and review the trend.")

    if data["temperature"] >= 38.0 or data["temperature"] < 35.5:
        flag("review", "Temperature outside screening range",
             f"Reported temperature is {data['temperature']} °C.", 10,
             "Repeat the measurement and check for illness symptoms.")

    if data["sleep_hours"] < 6 or data["sleep_quality"] <= 3:
        flag("review", "Reduced sleep recovery",
             f"{data['sleep_hours']} h sleep with quality {data['sleep_quality']}/10.", 10,
             "Protect the next sleep opportunity and reduce non-essential workload.")

    if data["stress"] >= 8:
        flag("review", "High perceived stress", "Self-reported stress is 8/10 or higher.", 8,
             "Use the mission-approved recovery or behavioral-health protocol.")

    if data["mood"] <= 3 or data["focus"] <= 3 or data["isolation"] >= 8:
        flag("review", "Behavioral-health signal",
             "Mood, focus, or isolation responses indicate additional review may be useful.", 7,
             "Consider a crew-support check-in and document the change.")

    symptom_count = sum(bool(data.get(k)) for k in
                        ["chest_pain", "breathing_difficulty", "dizziness"])
    if symptom_count:
        flag("urgent" if data["chest_pain"] or data["breathing_difficulty"] else "review",
             "Symptom alert",
             "Chest pain, breathing difficulty, or dizziness was reported.",
             20 if data["chest_pain"] or data["breathing_difficulty"] else 8,
             "Stop activity and follow mission medical protocol if symptoms are significant or persistent.")

    if data["hydration"] <= 3:
        flag("review", "Hydration below target", "Hydration self-rating is 3/10 or lower.", 7,
             "Increase approved fluid intake and reassess during the next rest period.")

    if data["exercise_minutes"] < 20:
        flag("review", "Low exercise volume", "Less than 20 minutes of exercise was reported.", 4,
             "Resume the planned exercise protocol when safe and appropriate.")

    if data["medication_change"] or data["recent_illness"]:
        flag("review", "Recent health change", "Medication change or recent illness was reported.", 5,
             "Record the change and review it with the designated medical support channel.")

    if data["unusual_change"]:
        flag("review", "Unusual health change", "The astronaut reported a change from their normal state.", 5,
             "Compare with recent telemetry and document the change.")

    score = int(clamp(score, 0, 100))
    urgent = any(f["severity"] == "urgent" for f in findings)
    if urgent:
        status = "URGENT REVIEW"
    elif score < 70:
        status = "MEDICAL REVIEW"
    elif score < 85:
        status = "MONITOR"
    else:
        status = "NOMINAL"

    if not findings:
        findings.append({"severity": "normal", "title": "No screening flags detected",
                         "detail": "Reported values did not trigger the configured screening rules."})
        actions.append("Continue routine monitoring and mission health protocol.")

    return {
        "score": score,
        "status": status,
        "findings": findings,
        "recommended_actions": list(dict.fromkeys(actions)),
        "disclaimer": "This is a decision-support screening tool, not a medical diagnosis. Follow mission medical protocols for concerning symptoms."
    }
