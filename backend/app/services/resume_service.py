"""
Resume Parser and NLP Skill Extraction Engine for CareerAI.
Extracts text from PDF, DOCX, TXT documents, identifies sections,
matches normalized skills from taxonomy, computes ATS compatibility score,
and generates actionable resume improvement feedback.
"""

import re
import io
from typing import Dict, Any, List, Set, Tuple
from pypdf import PdfReader
from docx import Document

from ml.features.skill_taxonomy import (
    ALL_TRACKED_SKILLS,
    SKILL_SYNONYMS,
    ROLE_SKILL_PROFILES,
    normalize_skill_name
)

SECTION_PATTERNS = {
    "education": r"(education|academic background|qualifications|degrees|academics)",
    "experience": r"(experience|work history|employment history|internship|work experience)",
    "skills": r"(technical skills|skills & expertise|skills|competencies|technologies|proficiencies)",
    "projects": r"(projects|academic projects|personal projects|key projects)",
    "certifications": r"(certifications|certificates|licenses|courses & certifications)"
}

ACTION_VERBS = {
    "developed", "engineered", "built", "designed", "implemented", "deployed",
    "optimized", "architected", "integrated", "analyzed", "spearheaded", "orchestrated",
    "managed", "created", "automated", "trained", "delivered", "collaborated"
}

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extract raw text from PDF, DOCX, or TXT file bytes."""
    fname = filename.lower()
    text = ""

    if fname.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    elif fname.endswith(".docx"):
        doc = Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            text += para.text + "\n"
    else: # Default TXT
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            text = file_bytes.decode("latin-1", errors="ignore")

    return text.strip()


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts all recognized technical skills from free-form text using
    boundary-safe matching and the normalized skill taxonomy.
    """
    text_lower = text.lower()
    found_skills: Set[str] = set()

    # 1. Check multi-word skills and single-word skills in taxonomy
    for skill in ALL_TRACKED_SKILLS:
        # Escaped regex pattern with word boundaries or punctuation boundaries
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    # 2. Check synonyms
    for syn, canonical in SKILL_SYNONYMS.items():
        pattern = r'(?<![a-zA-Z0-9])' + re.escape(syn) + r'(?![a-zA-Z0-9])'
        if re.search(pattern, text_lower):
            found_skills.add(canonical)

    return sorted(list(found_skills))


def analyze_resume_text(
    text: str,
    target_role: str = "Software Developer"
) -> Dict[str, Any]:
    """
    Comprehensive ATS-style heuristic resume analysis.
    Labels result explicitly as an Estimated Compatibility Score.
    """
    text_lower = text.lower()
    total_words = len(re.findall(r'\b\w+\b', text))

    # 1. Section presence
    detected_sections = {}
    for section, pattern in SECTION_PATTERNS.items():
        found = bool(re.search(pattern, text_lower))
        detected_sections[section] = found

    # 2. Skills extraction
    extracted_skills = extract_skills_from_text(text)

    # 3. Action verbs analysis
    found_action_verbs = [v for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', text_lower)]

    # 4. Metrics & Quantifiable achievements check (numbers, percentages, metrics)
    metrics_matches = re.findall(r'(\d+%\s*|\$\s*[\d,.]+|\b[\d,.]+\s*(?:k|m|users|clients|records|x|percent|ms|seconds)?\b|\b(?:reduced|increased|improved|optimized)\b)', text_lower)
    has_quantifiable_metrics = "%" in text_lower or len(re.findall(r'\b\d{2,}\b', text_lower)) >= 1 or len(metrics_matches) >= 2

    # 5. Contact / Links check (GitHub, LinkedIn, Email)
    has_email = bool(re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text))
    has_github = "github" in text_lower
    has_linkedin = "linkedin" in text_lower

    # 6. Target role keywords comparison
    role_profile = ROLE_SKILL_PROFILES.get(target_role, {})
    matched_role_skills = [s for s in extracted_skills if s in role_profile]
    missing_role_skills = [s for s in role_profile.keys() if s not in extracted_skills]

    # 7. Estimated ATS Compatibility Scoring Breakdown
    # - Sections score: max 25 pts (5 pts per major section)
    section_score = sum(5 for present in detected_sections.values() if present)
    
    # - Role Skill Match score: max 35 pts
    skill_coverage = len(matched_role_skills) / max(len(role_profile), 1)
    role_skill_score = min(skill_coverage * 35.0 + (10.0 if len(matched_role_skills) >= 3 else 0.0), 35.0)

    # - Action Verbs & Impact: max 15 pts
    action_score = min(len(found_action_verbs) * 3.5, 15.0)

    # - Metrics & Structure: max 15 pts
    metrics_score = 15.0 if has_quantifiable_metrics else (10.0 if len(metrics_matches) > 0 else 5.0)

    # - Contact & Professional links: max 10 pts
    contact_score = (4.0 if has_email else 0.0) + (3.0 if has_github else 0.0) + (3.0 if has_linkedin else 0.0)

    ats_score = int(round(section_score + role_skill_score + action_score + metrics_score + contact_score))
    ats_score = min(max(ats_score, 25), 98)

    # Strengths and Weaknesses
    strengths = []
    weaknesses = []

    if detected_sections.get("projects") and detected_sections.get("skills"):
        strengths.append("Clear structural organization with dedicated Projects and Skills sections.")
    if len(extracted_skills) >= 6:
        strengths.append(f"Identified {len(extracted_skills)} relevant technical competencies and tools.")
    if has_quantifiable_metrics:
        strengths.append("Includes quantifiable metrics and measurable project outcomes.")
    if has_github or has_linkedin:
        strengths.append("Includes professional portfolio/code links (GitHub / LinkedIn).")

    if not detected_sections.get("certifications"):
        weaknesses.append("Missing Certifications section to validate credentials.")
    if len(missing_role_skills) > 3:
        weaknesses.append(f"Missing high-impact skills for {target_role}: {', '.join(missing_role_skills[:3])}.")
    if not has_quantifiable_metrics:
        weaknesses.append("Lack of quantifiable achievements (e.g., 'improved latency by 35%', 'handled 10k requests').")
    if len(found_action_verbs) < 3:
        weaknesses.append("Limited strong action verbs (use 'engineered', 'spearheaded', 'optimized').")

    return {
        "ats_compatibility_score": ats_score,
        "score_label": "Estimated ATS Compatibility Score (Heuristic ML/NLP Assessment)",
        "total_words": total_words,
        "extracted_skills": extracted_skills,
        "matched_role_skills": matched_role_skills,
        "missing_keywords": missing_role_skills[:6],
        "sections_detected": detected_sections,
        "action_verbs_found": found_action_verbs,
        "has_quantifiable_metrics": has_quantifiable_metrics,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "target_role": target_role,
        "recommendations": [
            f"Incorporate missing core skills for {target_role}: {', '.join(missing_role_skills[:4])}.",
            "Quantify results in project bullet points using the Action + Task + Metric formula.",
            "Ensure standard headings (Education, Experience, Projects, Skills) are prominently positioned."
        ]
    }
