"""
Pydantic schemas for request validation and response serialization.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Authentication
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)

# Profile & Sub-entities
class EducationSchema(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_year: int
    end_year: int
    grade: str

class ProjectSchema(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None

class CertificationSchema(BaseModel):
    name: str
    issuing_org: str
    issue_date: str
    credential_url: Optional[str] = None

class ExperienceSchema(BaseModel):
    company: str
    role: str
    location: str
    start_date: str
    end_date: str
    description: str

class ProfileUpdate(BaseModel):
    headline: Optional[str] = None
    degree: Optional[str] = None
    gpa: Optional[float] = None
    years_experience: Optional[float] = None
    location: Optional[str] = None
    preferred_locations: Optional[str] = None
    target_role: Optional[str] = None
    skills: Optional[List[str]] = None
    certifications_count: Optional[int] = None
    projects_count: Optional[int] = None
    education: Optional[List[EducationSchema]] = None
    projects: Optional[List[ProjectSchema]] = None
    certifications: Optional[List[CertificationSchema]] = None
    experience: Optional[List[ExperienceSchema]] = None

class ProfileOut(BaseModel):
    id: int
    user_id: int
    headline: str
    degree: str
    gpa: float
    years_experience: float
    location: str
    preferred_locations: str
    target_role: str
    skills: List[str]
    certifications_count: int
    projects_count: int
    overall_readiness_score: int
    resume_score: float
    assessment_python: float
    assessment_sql: float
    assessment_ml: float
    assessment_dsa: float
    assessment_web: float
    assessment_stats: float
    assessment_aptitude: float

    model_config = ConfigDict(from_attributes=True)

# Career Predictions
class CareerPredictionRequest(BaseModel):
    skills: Optional[List[str]] = None
    degree: Optional[str] = "MCA"
    years_experience: Optional[float] = 0.0
    gpa: Optional[float] = 8.0
    certifications_count: Optional[int] = 1
    projects_count: Optional[int] = 2
    location: Optional[str] = "Bangalore"

# Skill Gap
class SkillGapRequest(BaseModel):
    skills: Optional[List[str]] = None
    target_role: str

# Assessments
class AssessmentSubmitRequest(BaseModel):
    answers: Dict[str, int]
