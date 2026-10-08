"""
Jobs API Router: Search, filter, and recommend jobs.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.entities import User, Profile
from backend.app.services.job_service import JobRecommendationEngine, _JOBS_CATALOG
from backend.app.api.v1.endpoints.career import _get_profile_features

router = APIRouter()

@router.get("")
def list_jobs(
    role: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    min_salary: Optional[float] = Query(None),
    max_experience: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    jobs = JobRecommendationEngine.get_all_jobs(
        role=role,
        location=location,
        min_salary=min_salary,
        max_experience=max_experience,
        search_query=search,
        limit=limit,
        offset=offset
    )
    total_count = len(_JOBS_CATALOG)
    return {
        "total": total_count,
        "returned": len(jobs),
        "jobs": jobs
    }


@router.get("/recommendations")
def get_job_recommendations(
    limit: int = Query(12, ge=1, le=50),
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_data = _get_profile_features(user, db)
    recommendations = JobRecommendationEngine.get_recommendations_for_user(profile_data, limit=limit)
    return {
        "candidate_skills": profile_data.get("skills", []),
        "recommendations": recommendations
    }


@router.get("/{job_id}")
def get_job_details(job_id: str):
    job = JobRecommendationEngine.get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
