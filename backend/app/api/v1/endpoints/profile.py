"""
Profile Router: View, edit, and sync candidate profile data.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import require_current_user, get_current_user
from backend.app.models.entities import User, Profile, Education, Project, Certification, Experience
from backend.app.schemas.schemas import ProfileUpdate
from ml.inference.predictor import CareerAIPredictor

router = APIRouter()

@router.get("")
def get_profile(
    db: Session = Depends(get_db),
    user: User = Depends(require_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id, skills_json='["python", "sql"]')
        db.add(profile)
        db.commit()
        db.refresh(profile)

    education_items = [
        {
            "id": e.id,
            "institution": e.institution,
            "degree": e.degree,
            "field_of_study": e.field_of_study,
            "start_year": e.start_year,
            "end_year": e.end_year,
            "grade": e.grade
        } for e in profile.education
    ]

    project_items = [
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "tech_stack": p.tech_stack,
            "github_url": p.github_url,
            "live_url": p.live_url
        } for p in profile.projects
    ]

    cert_items = [
        {
            "id": c.id,
            "name": c.name,
            "issuing_org": c.issuing_org,
            "issue_date": c.issue_date,
            "credential_url": c.credential_url
        } for c in profile.certifications
    ]

    exp_items = [
        {
            "id": ex.id,
            "company": ex.company,
            "role": ex.role,
            "location": ex.location,
            "start_date": ex.start_date,
            "end_date": ex.end_date,
            "description": ex.description
        } for ex in profile.experience
    ]

    skills_list = profile.get_skills_list()

    # Calculate real-time readiness
    predictor = CareerAIPredictor.get_instance()
    readiness = predictor.calculate_job_readiness({
        "skills": skills_list,
        "projects_count": len(project_items) or profile.projects_count,
        "certifications_count": len(cert_items) or profile.certifications_count,
        "years_experience": profile.years_experience,
        "gpa": profile.gpa,
        "resume_score": profile.resume_score,
        "assessment_python": profile.assessment_python,
        "assessment_sql": profile.assessment_sql,
        "assessment_ml": profile.assessment_ml,
        "assessment_dsa": profile.assessment_dsa,
        "assessment_aptitude": profile.assessment_aptitude
    }, target_role=profile.target_role)

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name
        },
        "profile": {
            "headline": profile.headline,
            "degree": profile.degree,
            "gpa": profile.gpa,
            "years_experience": profile.years_experience,
            "location": profile.location,
            "preferred_locations": profile.preferred_locations,
            "target_role": profile.target_role,
            "skills": skills_list,
            "certifications_count": max(len(cert_items), profile.certifications_count),
            "projects_count": max(len(project_items), profile.projects_count),
            "resume_score": profile.resume_score,
            "overall_readiness_score": readiness["overall_score"],
            "readiness_breakdown": readiness["breakdown"],
            "readiness_tier": readiness["tier"],
            "assessment_scores": {
                "python": profile.assessment_python,
                "sql": profile.assessment_sql,
                "ml": profile.assessment_ml,
                "dsa": profile.assessment_dsa,
                "web": profile.assessment_web,
                "stats": profile.assessment_stats,
                "aptitude": profile.assessment_aptitude
            }
        },
        "education": education_items,
        "projects": project_items,
        "certifications": cert_items,
        "experience": exp_items
    }


@router.put("")
def update_profile(
    update_in: ProfileUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if not profile:
        profile = Profile(user_id=user.id)
        db.add(profile)

    # Update scalar fields
    if update_in.headline is not None:
        profile.headline = update_in.headline
    if update_in.degree is not None:
        profile.degree = update_in.degree
    if update_in.gpa is not None:
        profile.gpa = update_in.gpa
    if update_in.years_experience is not None:
        profile.years_experience = update_in.years_experience
    if update_in.location is not None:
        profile.location = update_in.location
    if update_in.preferred_locations is not None:
        profile.preferred_locations = update_in.preferred_locations
    if update_in.target_role is not None:
        profile.target_role = update_in.target_role
    if update_in.skills is not None:
        profile.set_skills_list(update_in.skills)
    if update_in.certifications_count is not None:
        profile.certifications_count = update_in.certifications_count
    if update_in.projects_count is not None:
        profile.projects_count = update_in.projects_count

    # Update sub-lists if provided
    if update_in.education is not None:
        db.query(Education).filter(Education.profile_id == profile.id).delete()
        for edu in update_in.education:
            db.add(Education(
                profile_id=profile.id,
                institution=edu.institution,
                degree=edu.degree,
                field_of_study=edu.field_of_study,
                start_year=edu.start_year,
                end_year=edu.end_year,
                grade=edu.grade
            ))

    if update_in.projects is not None:
        db.query(Project).filter(Project.profile_id == profile.id).delete()
        for p in update_in.projects:
            db.add(Project(
                profile_id=profile.id,
                title=p.title,
                description=p.description,
                tech_stack=p.tech_stack,
                github_url=p.github_url,
                live_url=p.live_url
            ))
        profile.projects_count = len(update_in.projects)

    if update_in.certifications is not None:
        db.query(Certification).filter(Certification.profile_id == profile.id).delete()
        for c in update_in.certifications:
            db.add(Certification(
                profile_id=profile.id,
                name=c.name,
                issuing_org=c.issuing_org,
                issue_date=c.issue_date,
                credential_url=c.credential_url
            ))
        profile.certifications_count = len(update_in.certifications)

    if update_in.experience is not None:
        db.query(Experience).filter(Experience.profile_id == profile.id).delete()
        for ex in update_in.experience:
            db.add(Experience(
                profile_id=profile.id,
                company=ex.company,
                role=ex.role,
                location=ex.location,
                start_date=ex.start_date,
                end_date=ex.end_date,
                description=ex.description
            ))

    db.commit()
    db.refresh(profile)
    return {"status": "success", "message": "Profile updated successfully."}
