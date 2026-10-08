"""
SQLAlchemy ORM Entities for CareerAI Platform.
Defines users, profiles, skills, education, certifications, projects,
experience, assessment results, career predictions, and resume analyses.
"""

from datetime import datetime, timezone
import json
from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    assessments = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    career_predictions = relationship("CareerPredictionRecord", back_populates="user", cascade="all, delete-orphan")
    resume_analyses = relationship("ResumeAnalysisRecord", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    headline = Column(String(255), default="Aspiring Software Professional")
    degree = Column(String(100), default="MCA")
    gpa = Column(Float, default=8.0)
    years_experience = Column(Float, default=0.0)
    location = Column(String(100), default="Bangalore")
    preferred_locations = Column(String(255), default="Bangalore, Hyderabad, Remote")
    target_role = Column(String(100), default="Software Developer")
    
    # Comma-separated or JSON list of skills
    skills_json = Column(Text, default="[]")
    
    certifications_count = Column(Integer, default=1)
    projects_count = Column(Integer, default=2)
    
    # Assessment category cache scores (0-100)
    assessment_python = Column(Float, default=65.0)
    assessment_sql = Column(Float, default=60.0)
    assessment_ml = Column(Float, default=55.0)
    assessment_dsa = Column(Float, default=60.0)
    assessment_web = Column(Float, default=60.0)
    assessment_stats = Column(Float, default=55.0)
    assessment_aptitude = Column(Float, default=70.0)
    soft_skills_score = Column(Float, default=75.0)
    
    resume_score = Column(Float, default=70.0)
    overall_readiness_score = Column(Integer, default=72)

    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="profile")
    education = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")
    experience = relationship("Experience", back_populates="profile", cascade="all, delete-orphan")

    def get_skills_list(self):
        try:
            return json.loads(self.skills_json)
        except Exception:
            return [s.strip() for s in self.skills_json.split(",") if s.strip()]

    def set_skills_list(self, skills):
        self.skills_json = json.dumps(skills)


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    institution = Column(String(255), nullable=False)
    degree = Column(String(100), nullable=False)
    field_of_study = Column(String(150), default="Computer Science & Applications")
    start_year = Column(Integer, default=2022)
    end_year = Column(Integer, default=2024)
    grade = Column(String(50), default="8.2 CGPA")

    profile = relationship("Profile", back_populates="education")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(255), default="Python, React, PostgreSQL")
    github_url = Column(String(255), nullable=True)
    live_url = Column(String(255), nullable=True)

    profile = relationship("Profile", back_populates="projects")


class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    issuing_org = Column(String(255), default="Coursera / AWS / Google")
    issue_date = Column(String(50), default="2025")
    credential_url = Column(String(255), nullable=True)

    profile = relationship("Profile", back_populates="certifications")


class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    company = Column(String(255), nullable=False)
    role = Column(String(150), nullable=False)
    location = Column(String(100), default="Bangalore")
    start_date = Column(String(50), default="Jan 2025")
    end_date = Column(String(50), default="Present")
    description = Column(Text, default="Worked on full stack microservices and database optimization.")

    profile = relationship("Profile", back_populates="experience")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(100), nullable=False)
    score = Column(Float, nullable=False)
    correct_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    details_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="assessments")


class CareerPredictionRecord(Base):
    __tablename__ = "career_predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    predicted_role = Column(String(100), nullable=False)
    match_percentage = Column(Float, nullable=False)
    salary_min_lpa = Column(Float, default=6.0)
    salary_max_lpa = Column(Float, default=14.0)
    reasons_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="career_predictions")


class ResumeAnalysisRecord(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ats_score = Column(Integer, default=75)
    extracted_skills_json = Column(Text, default="[]")
    missing_keywords_json = Column(Text, default="[]")
    strengths_json = Column(Text, default="[]")
    weaknesses_json = Column(Text, default="[]")
    raw_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="resume_analyses")
