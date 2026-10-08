"""
Resume Analyzer API Router: Handles PDF, DOCX, TXT file uploads & text analysis.
"""

from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.entities import User, Profile, ResumeAnalysisRecord
from backend.app.services.resume_service import extract_text_from_file, analyze_resume_text
import json

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    target_role: Optional[str] = Form("Software Developer"),
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    text = ""
    filename = "resume.txt"

    if file:
        filename = file.filename or "resume"
        # Validate file format
        allowed_exts = [".pdf", ".docx", ".txt"]
        if not any(filename.lower().endswith(ext) for ext in allowed_exts):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file format. Please upload PDF, DOCX, or TXT file."
            )
        
        file_bytes = await file.read()
        if len(file_bytes) > 8 * 1024 * 1024: # 8 MB max
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds maximum limit of 8MB."
            )
        text = extract_text_from_file(file_bytes, filename)
    elif resume_text:
        text = resume_text.strip()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a resume file or paste resume text."
        )

    if len(text) < 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract sufficient text from the resume. Please check the document format."
        )

    role_to_check = target_role or "Software Developer"
    analysis = analyze_resume_text(text, target_role=role_to_check)

    # Save to user history & update profile resume score if user logged in
    if user:
        profile = db.query(Profile).filter(Profile.user_id == user.id).first()
        if profile:
            profile.resume_score = float(analysis["ats_compatibility_score"])
            # Auto-merge newly discovered skills into profile
            existing_skills = set(profile.get_skills_list())
            for sk in analysis["extracted_skills"]:
                existing_skills.add(sk)
            profile.set_skills_list(sorted(list(existing_skills)))
            db.commit()

        record = ResumeAnalysisRecord(
            user_id=user.id,
            ats_score=analysis["ats_compatibility_score"],
            extracted_skills_json=json.dumps(analysis["extracted_skills"]),
            missing_keywords_json=json.dumps(analysis["missing_keywords"]),
            strengths_json=json.dumps(analysis["strengths"]),
            weaknesses_json=json.dumps(analysis["weaknesses"]),
            raw_text=text[:3000]
        )
        db.add(record)
        db.commit()

    return {
        "filename": filename,
        "analysis": analysis
    }
