"""
Skill Taxonomy & Role Definitions for CareerAI Platform.
Defines the 8 core MVP tech roles, skill profiles, and synonym mappings.
"""

from typing import Dict, List, Set

# 8 Core MVP Roles
ROLES: List[str] = [
    "Data Analyst",
    "Data Scientist",
    "Machine Learning Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Business Analyst"
]

# Structured career-to-skills mapping with importance weights (0.5 to 1.0)
ROLE_SKILL_PROFILES: Dict[str, Dict[str, float]] = {
    "Data Analyst": {
        "python": 0.85,
        "sql": 1.0,
        "excel": 0.9,
        "power bi": 0.9,
        "tableau": 0.85,
        "pandas": 0.9,
        "statistics": 0.9,
        "data visualization": 0.95,
        "business intelligence": 0.85,
        "data cleaning": 0.9,
        "communication": 0.8
    },
    "Data Scientist": {
        "python": 1.0,
        "sql": 0.9,
        "statistics": 0.95,
        "machine learning": 1.0,
        "pandas": 0.95,
        "numpy": 0.9,
        "scikit-learn": 0.95,
        "data visualization": 0.85,
        "deep learning": 0.8,
        "feature engineering": 0.9
    },
    "Machine Learning Engineer": {
        "python": 1.0,
        "machine learning": 1.0,
        "deep learning": 0.95,
        "scikit-learn": 0.95,
        "pytorch": 0.9,
        "tensorflow": 0.85,
        "docker": 0.85,
        "fastapi": 0.8,
        "git": 0.85,
        "sql": 0.75
    },
    "Backend Developer": {
        "python": 0.9,
        "sql": 0.95,
        "postgresql": 0.9,
        "rest apis": 0.95,
        "fastapi": 0.85,
        "nodejs": 0.8,
        "docker": 0.85,
        "git": 0.9,
        "data structures": 0.85,
        "system design": 0.8
    },
    "Frontend Developer": {
        "javascript": 1.0,
        "typescript": 0.9,
        "react": 0.95,
        "html": 1.0,
        "css": 1.0,
        "tailwind css": 0.85,
        "responsive design": 0.9,
        "rest apis": 0.8,
        "git": 0.85
    },
    "Full Stack Developer": {
        "javascript": 0.95,
        "typescript": 0.9,
        "react": 0.9,
        "nodejs": 0.85,
        "python": 0.8,
        "sql": 0.85,
        "html": 0.9,
        "css": 0.85,
        "rest apis": 0.95,
        "git": 0.9,
        "docker": 0.8
    },
    "DevOps Engineer": {
        "linux": 0.95,
        "docker": 0.95,
        "kubernetes": 0.95,
        "ci/cd": 0.95,
        "aws": 0.9,
        "bash": 0.85,
        "git": 0.9,
        "python": 0.75
    },
    "Business Analyst": {
        "sql": 0.9,
        "excel": 0.95,
        "power bi": 0.9,
        "tableau": 0.85,
        "communication": 0.95,
        "data analysis": 0.9,
        "statistics": 0.8,
        "business intelligence": 0.9
    }
}

# Synonyms and variations for NLP normalization
SKILL_SYNONYMS: Dict[str, str] = {
    # Data & ML
    "ml": "machine learning",
    "machine-learning": "machine learning",
    "deep-learning": "deep learning",
    "dl": "deep learning",
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "tf": "tensorflow",
    "powerbi": "power bi",
    "ms excel": "excel",
    "bi": "business intelligence",
    "data analytics": "data analysis",
    "stats": "statistics",

    # Web & Languages
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "nodejs",
    "node.js": "nodejs",
    "node": "nodejs",
    "tailwind": "tailwind css",
    "html5": "html",
    "css3": "css",
    "restful apis": "rest apis",
    "rest api": "rest apis",
    "rest": "rest apis",
    "dsa": "data structures",

    # Cloud & DevOps
    "k8s": "kubernetes",
    "kube": "kubernetes",
    "amazon web services": "aws",
    "cicd": "ci/cd",
    "shell scripting": "bash",
    "shell": "bash",

    # Databases
    "postgres": "postgresql",
    "psql": "postgresql",
    "rdbms": "sql"
}

# Flat master list of all tracked skills
ALL_TRACKED_SKILLS: List[str] = sorted(list({
    skill
    for role_skills in ROLE_SKILL_PROFILES.values()
    for skill in role_skills.keys()
}))

def normalize_skill_name(raw_name: str) -> str:
    """Normalize raw skill strings to standard taxonomy identifier."""
    cleaned = raw_name.strip().lower()
    return SKILL_SYNONYMS.get(cleaned, cleaned)
