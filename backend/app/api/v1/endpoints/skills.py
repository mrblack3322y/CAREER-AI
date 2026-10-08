"""
Skills Router: Taxonomy, role profiles, and search.
"""

from typing import Optional, List
from fastapi import APIRouter, Query
from ml.features.skill_taxonomy import (
    ALL_TRACKED_SKILLS,
    ROLE_SKILL_PROFILES,
    ROLES,
    normalize_skill_name
)

router = APIRouter()

@router.get("")
def list_skills(search: Optional[str] = Query(None)):
    skills = ALL_TRACKED_SKILLS
    if search:
        s = search.lower()
        skills = [sk for sk in skills if s in sk]
    return {
        "count": len(skills),
        "skills": skills
    }


@router.get("/roles")
def list_roles():
    return {
        "roles": ROLES,
        "role_profiles": ROLE_SKILL_PROFILES
    }
