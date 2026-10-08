"""
Job Recommendation Engine and Seeded Jobs Repository for CareerAI.
Implements multi-attribute weighted compatibility matching:
  Technical Skills: 50%
  Experience: 15%
  Education: 10%
  Certifications: 10%
  Projects: 10%
  Location/Other: 5%
"""

import json
import random
from typing import List, Dict, Any, Optional
from ml.features.skill_taxonomy import (
    ROLES,
    ROLE_SKILL_PROFILES,
    normalize_skill_name
)
from ml.data.dataset_generator import LOCATIONS, DEGREES

COMPANIES = [
    "Google", "Microsoft", "Amazon", "Razorpay", "Flipkart", "Swiggy",
    "Zomato", "TCS Digital", "Infosys", "Wipro", "Atlassian", "Uber",
    "Cisco", "PhonePe", "CRED", "Paytm", "Oracle", "IBM", "Accenture",
    "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "Adobe", "Salesforce"
]

JOB_TYPES = ["Full-Time", "Full-Time", "Full-Time", "Internship", "Contract"]

def generate_seeded_jobs_catalog(count: int = 150) -> List[Dict[str, Any]]:
    """Generates a realistic catalog of 150 diverse tech jobs across 8 MVP roles."""
    random.seed(1337)
    catalog = []

    for i in range(count):
        role = random.choice(ROLES)
        company = random.choice(COMPANIES[:14]) # 14 top companies
        location = random.choice(LOCATIONS)
        job_type = random.choice(JOB_TYPES)
        degree = random.choice(DEGREES)
        
        # Experience requirement (0-1, 1-3, 2-5)
        min_exp = int(random.choice([0, 0, 1, 1, 2, 3]))
        max_exp = min_exp + random.choice([2, 3])

        # Salary ranges in LPA
        base_sal = {
            "Data Analyst": (5.0, 11.0),
            "Data Scientist": (8.0, 18.0),
            "Machine Learning Engineer": (9.0, 22.0),
            "Backend Developer": (6.5, 15.0),
            "Frontend Developer": (6.0, 14.0),
            "Full Stack Developer": (7.0, 16.0),
            "DevOps Engineer": (7.5, 17.0),
            "Business Analyst": (5.5, 12.0)
        }[role]

        sal_min = round(base_sal[0] + min_exp * 1.5, 1)
        sal_max = round(base_sal[1] + max_exp * 2.0, 1)

        # Select 5 to 8 required skills from the role's profile
        role_skills = list(ROLE_SKILL_PROFILES[role].keys())
        req_skills_count = random.randint(5, min(8, len(role_skills)))
        required_skills = random.sample(role_skills, req_skills_count)

        catalog.append({
            "id": f"JOB_{i+1:04d}",
            "title": f"{random.choice(['Junior', 'Associate', '', 'Senior' if min_exp >= 3 else ''])} {role}".strip(),
            "role": role,
            "company": company,
            "location": location,
            "job_type": job_type,
            "min_experience": min_exp,
            "max_experience": max_exp,
            "required_education": degree,
            "salary_min_lpa": sal_min,
            "salary_max_lpa": sal_max,
            "salary_range": f"INR {sal_min} - {sal_max} LPA",
            "required_skills": required_skills,
            "description": (
                f"Join {company} as a {role}! We are seeking an enthusiastic engineer skilled in "
                f"{', '.join(required_skills[:3])} to build scalable production platforms. "
                f"You will collaborate with cross-functional teams to deliver impactful products."
            ),
            "posted_days_ago": random.randint(1, 28)
        })

    return catalog

# Global in-memory cache of seeded jobs
_JOBS_CATALOG = generate_seeded_jobs_catalog()


class JobRecommendationEngine:
    """Computes weighted candidate-job compatibility and ranking."""

    @staticmethod
    def get_all_jobs(
        role: Optional[str] = None,
        location: Optional[str] = None,
        min_salary: Optional[float] = None,
        max_experience: Optional[int] = None,
        search_query: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Dict[str, Any]]:
        filtered = _JOBS_CATALOG

        if role:
            filtered = [j for j in filtered if j["role"].lower() == role.lower()]
        if location:
            filtered = [j for j in filtered if j["location"].lower() == location.lower()]
        if min_salary:
            filtered = [j for j in filtered if j["salary_max_lpa"] >= min_salary]
        if max_experience is not None:
            filtered = [j for j in filtered if j["min_experience"] <= max_experience]
        if search_query:
            q = search_query.lower()
            filtered = [
                j for j in filtered
                if q in j["title"].lower() or q in j["company"].lower() or any(q in s for s in j["required_skills"])
            ]

        return filtered[offset:offset + limit]

    @staticmethod
    def get_job_by_id(job_id: str) -> Optional[Dict[str, Any]]:
        for j in _JOBS_CATALOG:
            if j["id"] == job_id:
                return j
        return None

    @classmethod
    def calculate_job_compatibility(
        cls,
        candidate_profile: Dict[str, Any],
        job: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates weighted match between candidate profile and a specific job:
          - Technical skills: 50%
          - Experience: 15%
          - Education: 10%
          - Certifications: 10%
          - Projects: 10%
          - Other/Location: 5%
        """
        raw_skills = candidate_profile.get("skills", [])
        if isinstance(raw_skills, str):
            raw_skills = [s.strip() for s in raw_skills.split(",") if s.strip()]
        candidate_skills = {normalize_skill_name(s) for s in raw_skills if s}

        req_skills = [normalize_skill_name(s) for s in job.get("required_skills", [])]
        matched_skills = [s for s in req_skills if s in candidate_skills]
        missing_skills = [s for s in req_skills if s not in candidate_skills]

        # 1. Technical Skills (50%)
        skill_pct = (len(matched_skills) / max(len(req_skills), 1)) * 100
        tech_score = skill_pct * 0.50

        # 2. Experience (15%)
        cand_exp = float(candidate_profile.get("years_experience", 0))
        job_min_exp = float(job.get("min_experience", 0))
        if cand_exp >= job_min_exp:
            exp_match = 100.0
        elif cand_exp >= max(job_min_exp - 1, 0):
            exp_match = 70.0
        else:
            exp_match = 35.0
        exp_score = exp_match * 0.15

        # 3. Education (10%)
        cand_degree = str(candidate_profile.get("degree", ""))
        req_degree = str(job.get("required_education", ""))
        edu_match = 100.0 if cand_degree == req_degree or cand_degree in ["MCA", "M.Tech CS", "B.Tech CS"] else 75.0
        edu_score = edu_match * 0.10

        # 4. Certifications (10%)
        certs = int(candidate_profile.get("certifications_count", 0))
        cert_match = min(certs * 35.0 + 30.0, 100.0) if certs > 0 else 40.0
        cert_score = cert_match * 0.10

        # 5. Projects (10%)
        projs = int(candidate_profile.get("projects_count", 0))
        proj_match = min(projs * 25.0 + 25.0, 100.0) if projs > 0 else 30.0
        proj_score = proj_match * 0.10

        # 6. Location / Other (5%)
        cand_loc = str(candidate_profile.get("location", ""))
        job_loc = str(job.get("location", ""))
        loc_match = 100.0 if (cand_loc == job_loc or job_loc == "Remote" or cand_loc == "Remote") else 60.0
        loc_score = loc_match * 0.05

        overall_match = round(tech_score + exp_score + edu_score + cert_score + proj_score + loc_score, 1)
        overall_match = min(max(overall_match, 15.0), 99.0)

        # Match reasons
        match_reasons = []
        if len(matched_skills) >= 3:
            match_reasons.append(f"Matches {len(matched_skills)} required technical skills ({', '.join(matched_skills[:3])})")
        if cand_exp >= job_min_exp:
            match_reasons.append(f"Meets the {job_min_exp}+ years experience requirement")
        if certs >= 1:
            match_reasons.append(f"Has {certs} relevant certification(s)")
        if cand_loc == job_loc or job_loc == "Remote":
            match_reasons.append(f"Location alignment ({job_loc})")

        return {
            "job": job,
            "compatibility_score": overall_match,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "match_reasons": match_reasons,
            "score_breakdown": {
                "technical_skills_pts": round(tech_score, 1),
                "experience_pts": round(exp_score, 1),
                "education_pts": round(edu_score, 1),
                "certifications_pts": round(cert_score, 1),
                "projects_pts": round(proj_score, 1),
                "location_pts": round(loc_score, 1)
            }
        }

    @classmethod
    def get_recommendations_for_user(
        cls,
        candidate_profile: Dict[str, Any],
        limit: int = 15
    ) -> List[Dict[str, Any]]:
        """Rank all jobs for a user and return the top compatible matches."""
        scored_jobs = []
        for job in _JOBS_CATALOG:
            res = cls.calculate_job_compatibility(candidate_profile, job)
            scored_jobs.append(res)

        scored_jobs.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return scored_jobs[:limit]
