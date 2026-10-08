"""
Assessment Router: Deliver interactive MCQ tests and evaluate answers.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.entities import User, Profile, AssessmentResult
from backend.app.schemas.schemas import AssessmentSubmitRequest
from backend.app.services.assessment_service import AssessmentEngine
import json

router = APIRouter()

@router.get("/questions")
def get_assessment_questions(
    category: Optional[str] = Query(None),
    count: int = Query(10, ge=3, le=25)
):
    questions = AssessmentEngine.get_assessment_questions(category=category, count=count)
    return {
        "category": category or "All Categories",
        "count": len(questions),
        "questions": questions
    }


@router.post("/submit")
def submit_assessment(
    req: AssessmentSubmitRequest,
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not req.answers:
        raise HTTPException(status_code=400, detail="No answers provided in submission.")

    eval_result = AssessmentEngine.evaluate_submission(req.answers)

    # If user logged in, persist record and update profile category scores
    if user:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile:
            # Map category performance into profile feature columns
            cat_perf = eval_result["category_performance"]
            if "Python" in cat_perf:
                profile.assessment_python = cat_perf["Python"]
            if "SQL" in cat_perf:
                profile.assessment_sql = cat_perf["SQL"]
            if "Machine Learning" in cat_perf:
                profile.assessment_ml = cat_perf["Machine Learning"]
            if "Data Structures" in cat_perf:
                profile.assessment_dsa = cat_perf["Data Structures"]
            if "Web Development" in cat_perf:
                profile.assessment_web = cat_perf["Web Development"]
            if "Statistics" in cat_perf:
                profile.assessment_stats = cat_perf["Statistics"]
            if "Aptitude" in cat_perf:
                profile.assessment_aptitude = cat_perf["Aptitude"]

        record = AssessmentResult(
            user_id=user.id,
            category="Comprehensive",
            score=eval_result["overall_score"],
            correct_count=eval_result["correct_count"],
            total_count=eval_result["total_questions"],
            details_json=json.dumps(eval_result["detailed_review"][:10])
        )
        db.add(record)
        db.commit()

    return eval_result
