"""
Synthetic Dataset Generator for CareerAI.
Generates realistic, reproducible student profiles, career outcomes, and salaries.
Designed to be easily replaced by real historical student/placement datasets.
"""

import os
import random
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from ml.features.skill_taxonomy import ROLES, ROLE_SKILL_PROFILES, ALL_TRACKED_SKILLS

LOCATIONS = [
    "Bangalore", "Hyderabad", "Pune", "Delhi NCR", "Mumbai", "Chennai", "Remote"
]

DEGREES = [
    "MCA", "B.Tech CS", "B.Tech IT", "BCA", "B.Sc CS", "M.Tech CS", "Data Science MS"
]

# Base salary ranges in LPA (Lakhs per Annum) by role for freshers/early career
ROLE_SALARY_BASE = {
    "Data Analyst": (4.5, 9.5),
    "Data Scientist": (7.0, 16.0),
    "Machine Learning Engineer": (8.0, 18.0),
    "Backend Developer": (5.5, 13.0),
    "Frontend Developer": (5.0, 12.0),
    "Full Stack Developer": (6.0, 14.0),
    "DevOps Engineer": (6.5, 15.0),
    "Business Analyst": (5.0, 11.5)
}

def generate_synthetic_profiles(
    num_samples: int = 3000,
    random_seed: int = 42
) -> pd.DataFrame:
    """
    Generate synthetic profiles with correlated skills, assessment scores,
    and realistic salary targets.
    """
    np.random.seed(random_seed)
    random.seed(random_seed)

    records = []

    for i in range(num_samples):
        # Pick a primary target role (ground truth affinity)
        role = random.choice(ROLES)
        role_profile = ROLE_SKILL_PROFILES[role]
        
        # Experience: 0 to 4 years (mostly 0-2 yrs for student/recent grad focus)
        exp = float(np.clip(np.random.exponential(scale=0.9), 0.0, 5.0))
        degree = random.choice(DEGREES)
        gpa = round(float(np.random.normal(loc=7.8, scale=1.1)), 2)
        gpa = float(np.clip(gpa, 5.5, 9.9))
        
        certifications_count = int(np.random.choice([0, 1, 2, 3, 4], p=[0.25, 0.35, 0.25, 0.1, 0.05]))
        projects_count = int(np.random.choice([1, 2, 3, 4, 5, 6], p=[0.15, 0.3, 0.25, 0.15, 0.1, 0.05]))
        location = random.choice(LOCATIONS)

        # Generate Skill Vector
        # Skills aligned with the role have a high probability of presence (0.75 - 0.95)
        # Random non-role skills have lower probability (0.08 - 0.20)
        skills_dict: Dict[str, int] = {}
        active_skills_list = []
        for skill in ALL_TRACKED_SKILLS:
            if skill in role_profile:
                prob = 0.55 + 0.40 * role_profile[skill]
                # Slight noise
                has_skill = 1 if np.random.rand() < prob else 0
            else:
                has_skill = 1 if np.random.rand() < 0.12 else 0
            
            skills_dict[f"skill_{skill}"] = has_skill
            if has_skill:
                active_skills_list.append(skill)

        # Assessment scores (correlated with role domain)
        # Base aptitude & soft skills
        aptitude = int(np.clip(np.random.normal(70, 14), 35, 100))
        soft_skills = int(np.clip(np.random.normal(72, 12), 40, 100))

        # Python assessment
        py_boost = 25 if "python" in role_profile else 0
        python_score = int(np.clip(np.random.normal(55 + py_boost, 15), 30, 100))

        # SQL assessment
        sql_boost = 25 if "sql" in role_profile else 0
        sql_score = int(np.clip(np.random.normal(52 + sql_boost, 15), 30, 100))

        # ML assessment
        ml_boost = 30 if "machine learning" in role_profile else 0
        ml_score = int(np.clip(np.random.normal(45 + ml_boost, 16), 25, 100))

        # DSA assessment
        dsa_boost = 25 if "data structures" in role_profile or role in ["Software Developer", "Backend Developer"] else 0
        dsa_score = int(np.clip(np.random.normal(50 + dsa_boost, 16), 25, 100))

        # Web assessment
        web_boost = 30 if role in ["Frontend Developer", "Full Stack Developer", "Backend Developer"] else 0
        web_score = int(np.clip(np.random.normal(48 + web_boost, 16), 25, 100))

        # Stats assessment
        stats_boost = 28 if role in ["Data Scientist", "Data Analyst"] else 0
        stats_score = int(np.clip(np.random.normal(50 + stats_boost, 15), 25, 100))

        # Salary calculation with realistic multi-factor regression formula + noise
        base_low, base_high = ROLE_SALARY_BASE[role]
        avg_base = (base_low + base_high) / 2.0
        
        # Skill count factor
        skill_count_factor = len(active_skills_list) * 0.25
        # Exp factor (each year adds ~1.5 - 2.5 LPA)
        exp_factor = exp * 2.2
        # Assessment score factor
        avg_assessment = (python_score + sql_score + ml_score + dsa_score + web_score + stats_score + aptitude) / 7.0
        score_factor = (avg_assessment - 60) * 0.08
        # Projects & certs
        proj_factor = projects_count * 0.35 + certifications_count * 0.4
        # Degree premium
        degree_bonus = 1.0 if degree in ["M.Tech CS", "Data Science MS"] else (0.5 if degree in ["MCA", "B.Tech CS"] else 0.0)
        # Location factor
        loc_bonus = 0.8 if location in ["Bangalore", "Hyderabad", "Remote"] else 0.0

        noise = np.random.normal(0, 0.8)
        salary = avg_base + exp_factor + skill_count_factor + score_factor + proj_factor + degree_bonus + loc_bonus + noise
        salary_lpa = round(float(np.clip(salary, 3.5, 38.0)), 2)

        record = {
            "candidate_id": f"CAND_{i+1:05d}",
            "target_role": role,
            "years_experience": round(exp, 1),
            "degree": degree,
            "gpa": gpa,
            "certifications_count": certifications_count,
            "projects_count": projects_count,
            "location": location,
            "assessment_python": python_score,
            "assessment_sql": sql_score,
            "assessment_ml": ml_score,
            "assessment_dsa": dsa_score,
            "assessment_web": web_score,
            "assessment_stats": stats_score,
            "assessment_aptitude": aptitude,
            "soft_skills_score": soft_skills,
            "skills_list": ",".join(active_skills_list),
            "salary_lpa": salary_lpa
        }
        # Merge individual binary skill columns
        record.update(skills_dict)
        records.append(record)

    df = pd.DataFrame(records)
    return df

def save_synthetic_dataset(output_path: str, num_samples: int = 3500) -> pd.DataFrame:
    """Generate and save the synthetic dataset to CSV."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df = generate_synthetic_profiles(num_samples=num_samples)
    df.to_csv(output_path, index=False)
    print(f"Synthetic dataset saved with {len(df)} samples to {output_path}")
    return df

if __name__ == "__main__":
    output_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasets", "students_career_data.csv")
    save_synthetic_dataset(output_file)
