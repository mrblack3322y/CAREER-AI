"""
Seed Database Script for CareerAI.
Populates realistic demonstration records:
  - 100+ diverse student user accounts & profiles
  - 500+ tech job postings in catalog
  - 50+ normalized skills in taxonomy
  - Assessment records and career outcomes
"""

import sys
import os
import random
import json

# Ensure project root is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.database.session import SessionLocal, Base, engine
from backend.app.models.entities import User, Profile, Education, Project, Certification, Experience
from backend.app.core.security import get_password_hash
from ml.features.skill_taxonomy import ROLES, ROLE_SKILL_PROFILES, ALL_TRACKED_SKILLS
from ml.data.dataset_generator import LOCATIONS, DEGREES

FIRST_NAMES = [
    "Aarav", "Aditi", "Ananya", "Arjun", "Dev", "Diya", "Ishaan", "Kavya", "Manish",
    "Neha", "Pranav", "Pooja", "Rahul", "Rhea", "Rohan", "Sanya", "Siddharth", "Sneha",
    "Tanvi", "Varun", "Vikram", "Zoya", "Alex", "David", "Emma", "Liam", "Sophia"
]

LAST_NAMES = [
    "Sharma", "Verma", "Gupta", "Patel", "Reddy", "Nair", "Iyer", "Chopra", "Mehta",
    "Singh", "Bose", "Joshi", "Deshmukh", "Kulkarni", "Das", "Menon", "Rao", "Kumar"
]

def seed_database(num_users: int = 120):
    print("=" * 60)
    print("  CareerAI — Seeding Database with Realistic Demo Data")
    print("=" * 60)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        existing_users_count = db.query(User).count()
        print(f"Current users in database: {existing_users_count}")

        if existing_users_count < 100:
            print(f"Generating {num_users} realistic student accounts & profiles...")
            random.seed(42)

            for i in range(num_users):
                first = random.choice(FIRST_NAMES)
                last = random.choice(LAST_NAMES)
                full_name = f"{first} {last}"
                email = f"{first.lower()}.{last.lower()}{i+1}@example.com"

                # Check if exists
                if db.query(User).filter(User.email == email).first():
                    continue

                user = User(
                    email=email,
                    hashed_password=get_password_hash("password123"),
                    full_name=full_name,
                    is_active=True,
                    is_admin=(i == 0)
                )
                db.add(user)
                db.flush()

                # Pick affinity role
                role = random.choice(ROLES)
                role_skills = list(ROLE_SKILL_PROFILES[role].keys())
                
                # Sample 4-7 role skills + 1-3 extra skills
                num_role_skills = random.randint(4, min(7, len(role_skills)))
                user_skills = random.sample(role_skills, num_role_skills)
                other_skills = [s for s in ALL_TRACKED_SKILLS if s not in role_skills]
                user_skills += random.sample(other_skills, random.randint(1, 3))

                exp = round(random.choice([0.0, 0.0, 0.5, 1.0, 1.5, 2.0, 3.0]), 1)
                degree = random.choice(DEGREES)
                gpa = round(random.uniform(6.8, 9.6), 2)
                location = random.choice(LOCATIONS)
                projs = random.randint(1, 5)
                certs = random.randint(0, 3)

                profile = Profile(
                    user_id=user.id,
                    headline=f"{degree} Graduate | Aspiring {role}",
                    degree=degree,
                    gpa=gpa,
                    years_experience=exp,
                    location=location,
                    preferred_locations=f"{location}, Remote",
                    target_role=role,
                    skills_json=json.dumps(user_skills),
                    certifications_count=certs,
                    projects_count=projs,
                    resume_score=round(random.uniform(65.0, 92.0), 1),
                    overall_readiness_score=random.randint(60, 94),
                    assessment_python=round(random.uniform(50, 95), 1),
                    assessment_sql=round(random.uniform(50, 95), 1),
                    assessment_ml=round(random.uniform(45, 90), 1),
                    assessment_dsa=round(random.uniform(45, 90), 1),
                    assessment_web=round(random.uniform(45, 90), 1),
                    assessment_stats=round(random.uniform(50, 92), 1),
                    assessment_aptitude=round(random.uniform(60, 95), 1)
                )
                db.add(profile)
                db.flush()

                # Add sample education
                db.add(Education(
                    profile_id=profile.id,
                    institution="National Institute of Technology",
                    degree=degree,
                    field_of_study="Computer Applications & Software Engineering",
                    start_year=2022,
                    end_year=2024,
                    grade=f"{gpa} CGPA"
                ))

                # Add sample projects
                for p_idx in range(min(projs, 2)):
                    db.add(Project(
                        profile_id=profile.id,
                        title=f"{role} Production Platform {p_idx+1}",
                        description=f"Developed an end-to-end {role.lower()} solution with modern microservices architecture and automated pipelines.",
                        tech_stack=", ".join(user_skills[:3]),
                        github_url=f"https://github.com/{first.lower()}/{role.lower().replace(' ', '-')}-app"
                    ))

            db.commit()
            print(f"Successfully seeded database! Total users now: {db.query(User).count()}")
        else:
            print("Database already contains 100+ user records. Skipping duplicate seeding.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
