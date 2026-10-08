"""
Consolidated Dashboard Endpoint for CareerAI MVP.
Aggregates profile readiness, career predictions, top skill gaps,
recommended jobs, and learning roadmap phases into a single efficient response.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.entities import User, Profile
from backend.app.services.job_service import JobRecommendationEngine
from ml.inference.predictor import CareerAIPredictor
from backend.app.api.v1.endpoints.career import _get_profile_features

router = APIRouter()
predictor = CareerAIPredictor.get_instance()

@router.get("")
def get_dashboard_summary(
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    profile_data = _get_profile_features(user, db)
    target_role = profile_data.get("target_role", "Data Scientist")
    skills = profile_data.get("skills", [])

    # 1. Job Readiness Score & Breakdown
    readiness = predictor.calculate_job_readiness(profile_data, target_role=target_role)

    # 2. Top 3 Career Predictions
    career_recs = predictor.predict_career_recommendations(profile_data, top_k=3)

    # 3. Top Skill Gaps for Current Target Role
    skill_gap = predictor.analyze_skill_gap(skills, target_role)

    # 4. Top Recommended Jobs
    job_matches = JobRecommendationEngine.get_recommendations_for_user(profile_data, limit=4)

    # 5. Phase-based Learning Roadmap
    roadmap = predictor.generate_learning_roadmap(skills, target_role)

    # 6. Salary estimate for target role
    salary = predictor.predict_salary_range(profile_data, target_role=target_role)

    return {
        "candidate": {
            "name": user.full_name if user else "Alex Rivera",
            "email": user.email if user else "demo@careerai.com",
            "degree": profile_data.get("degree", "MCA"),
            "target_role": target_role,
            "skills_count": len(skills),
            "skills": skills
        },
        "readiness": readiness,
        "career_predictions": career_recs,
        "skill_gap": skill_gap,
        "recommended_jobs": job_matches,
        "learning_roadmap": roadmap,
        "salary_estimate": salary
    }
