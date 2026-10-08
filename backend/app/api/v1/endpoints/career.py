"""
Career Intelligence API Router.
Endpoints:
  - POST /predict (Model inference for career roles & rankings)
  - GET /recommendations (Top career matches for current user)
  - POST /salary-predict (Salary regression prediction)
  - POST /skill-gap (In-depth skill gap analysis)
  - POST /readiness-score (Transparent job readiness calculation)
  - GET /learning-roadmap (Personalized weekly learning roadmap)
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.entities import User, Profile
from backend.app.schemas.schemas import CareerPredictionRequest, SkillGapRequest
from ml.inference.predictor import CareerAIPredictor

router = APIRouter()
predictor = CareerAIPredictor.get_instance()

def _get_profile_features(user: Optional[User], db: Session) -> Dict[str, Any]:
    """Helper to extract profile features if user is logged in, or sensible defaults."""
    if user:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile:
            return {
                "skills": profile.get_skills_list(),
                "degree": profile.degree,
                "gpa": profile.gpa,
                "years_experience": profile.years_experience,
                "location": profile.location,
                "certifications_count": profile.certifications_count,
                "projects_count": profile.projects_count,
                "target_role": profile.target_role,
                "resume_score": profile.resume_score,
                "assessment_python": profile.assessment_python,
                "assessment_sql": profile.assessment_sql,
                "assessment_ml": profile.assessment_ml,
                "assessment_dsa": profile.assessment_dsa,
                "assessment_aptitude": profile.assessment_aptitude
            }
    return {
        "skills": ["python", "sql", "pandas", "machine learning"],
        "degree": "MCA",
        "gpa": 8.0,
        "years_experience": 0.5,
        "location": "Bangalore",
        "certifications_count": 1,
        "projects_count": 2,
        "target_role": "Data Scientist",
        "resume_score": 75.0,
        "assessment_python": 70.0,
        "assessment_sql": 65.0,
        "assessment_ml": 68.0,
        "assessment_dsa": 60.0,
        "assessment_aptitude": 75.0
    }


@router.post("/predict")
def predict_career(
    req: CareerPredictionRequest,
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    if req.skills is not None:
        profile_data["skills"] = req.skills
    if req.degree is not None:
        profile_data["degree"] = req.degree
    if req.years_experience is not None:
        profile_data["years_experience"] = req.years_experience
    if req.location is not None:
        profile_data["location"] = req.location

    recommendations = predictor.predict_career_recommendations(profile_data, top_k=6)
    
    # Also attach estimated salary for top recommended role
    top_role = recommendations[0]["role"] if recommendations else "Software Developer"
    salary_est = predictor.predict_salary_range(profile_data, target_role=top_role)

    return {
        "candidate_input": profile_data,
        "top_role": top_role,
        "top_match_percentage": recommendations[0]["match_percentage"] if recommendations else 0.0,
        "recommendations": recommendations,
        "salary_estimate": salary_est
    }


@router.get("/recommendations")
def get_user_career_recommendations(
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    recommendations = predictor.predict_career_recommendations(profile_data, top_k=5)
    return {
        "profile_summary": profile_data,
        "recommendations": recommendations
    }


@router.post("/salary-predict")
def predict_salary(
    req: Dict[str, Any],
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    # Merge custom overrides
    profile_data.update(req)
    target_role = req.get("target_role", profile_data.get("target_role", "Software Developer"))
    
    result = predictor.predict_salary_range(profile_data, target_role=target_role)
    return result


@router.post("/skill-gap")
def analyze_skill_gap(
    req: SkillGapRequest,
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    skills = req.skills if req.skills is not None else profile_data.get("skills", [])
    
    result = predictor.analyze_skill_gap(skills, req.target_role)
    return result


@router.post("/readiness-score")
def calculate_job_readiness(
    req: Dict[str, Any],
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    profile_data.update(req)
    target_role = req.get("target_role", profile_data.get("target_role"))

    result = predictor.calculate_job_readiness(profile_data, target_role=target_role)
    return result


@router.get("/learning-roadmap")
def get_learning_roadmap(
    target_role: Optional[str] = Query(None),
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    role_to_use = target_role or profile_data.get("target_role", "Software Developer")
    user_skills = profile_data.get("skills", [])

    roadmap = predictor.generate_learning_roadmap(user_skills, role_to_use)
    return roadmap
