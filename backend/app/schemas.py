
from typing import Optional, List
from pydantic import BaseModel, Field

class CrewUpdate(BaseModel):
    name: Optional[str] = None
    mission: Optional[str] = None
    mission_day: Optional[int] = Field(default=None, ge=0)
    mission_duration: Optional[int] = Field(default=None, ge=1)
    age: Optional[int] = Field(default=None, ge=18, le=100)
    alerts_enabled: Optional[bool] = None
    medical_sync_enabled: Optional[bool] = None
    quiet_hours_enabled: Optional[bool] = None

class ProfileCreate(BaseModel):
    name: str
    mission: str
    mission_day: int = Field(ge=0)
    mission_duration: int = Field(ge=1)
    age: int = Field(ge=18, le=100)

class AssessmentInput(BaseModel):
    age: int = Field(ge=18, le=100)
    sex: Optional[str] = None
    mission_day: int = Field(ge=0)
    sleep_hours: float = Field(ge=0, le=24)
    sleep_quality: int = Field(ge=0, le=10)
    heart_rate: float = Field(gt=20, lt=250)
    systolic_bp: Optional[float] = Field(default=None, gt=50, lt=250)
    diastolic_bp: Optional[float] = Field(default=None, gt=20, lt=180)
    spo2: float = Field(gt=50, le=100)
    temperature: float = Field(gt=30, lt=45)
    respiratory_rate: Optional[float] = Field(default=None, gt=2, lt=60)
    pain: int = Field(ge=0, le=10)
    chest_pain: bool = False
    breathing_difficulty: bool = False
    dizziness: bool = False
    headache: bool = False
    nausea: bool = False
    energy: int = Field(ge=0, le=10)
    mood: int = Field(ge=0, le=10)
    stress: int = Field(ge=0, le=10)
    focus: int = Field(ge=0, le=10)
    isolation: int = Field(ge=0, le=10)
    hydration: int = Field(ge=0, le=10)
    appetite: int = Field(ge=0, le=10)
    exercise_minutes: int = Field(ge=0, le=300)
    eva_exposure_hours: float = Field(ge=0, le=24)
    radiation_exposure_msv: Optional[float] = Field(default=None, ge=0)
    medication_change: bool = False
    recent_illness: bool = False
    unusual_change: bool = False

class Finding(BaseModel):
    severity: str
    title: str
    detail: str

class AssessmentResult(BaseModel):
    score: int
    status: str
    findings: List[Finding]
    recommended_actions: List[str]
    disclaimer: str
