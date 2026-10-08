"""
CareerAI — FastAPI Main Application Entrypoint.
Initializes database tables, middleware, routes, and startup seeding.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.database.session import engine, Base, SessionLocal
from backend.app.models.entities import User, Profile
from backend.app.core.security import get_password_hash

# Import API Routers
from backend.app.api.v1.endpoints import auth, profile, career, resume, jobs, assessment, skills, ml, dashboard

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade AI Career Intelligence & Job Recommendation Platform powered by Machine Learning.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["Dashboard"])
app.include_router(profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["Profile"])
app.include_router(career.router, prefix=f"{settings.API_V1_STR}/career", tags=["Career Intelligence"])
app.include_router(resume.router, prefix=f"{settings.API_V1_STR}/resume", tags=["Resume Analyzer"])
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["Job Recommendations"])
app.include_router(assessment.router, prefix=f"{settings.API_V1_STR}/assessment", tags=["Assessment System"])
app.include_router(skills.router, prefix=f"{settings.API_V1_STR}/skills", tags=["Skills Taxonomy"])
app.include_router(ml.router, prefix=f"{settings.API_V1_STR}/ml", tags=["ML Analytics"])

def seed_default_demo_user():
    """Ensure database has default demo user for easy portfolio evaluation."""
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "demo@careerai.com").first()
        if not demo_user:
            demo_user = User(
                email="demo@careerai.com",
                hashed_password=get_password_hash("demo123"),
                full_name="Alex Rivera",
                is_admin=True
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            demo_profile = Profile(
                user_id=demo_user.id,
                headline="MCA Graduate | Aspiring Machine Learning & Data Science Engineer",
                degree="MCA",
                gpa=8.4,
                years_experience=1.0,
                location="Bangalore",
                preferred_locations="Bangalore, Hyderabad, Remote",
                target_role="Data Scientist",
                skills_json='["python", "sql", "pandas", "numpy", "machine learning", "scikit-learn", "git", "data visualization", "docker"]',
                certifications_count=2,
                projects_count=3,
                resume_score=82.0,
                overall_readiness_score=84,
                assessment_python=85.0,
                assessment_sql=80.0,
                assessment_ml=78.0,
                assessment_dsa=75.0,
                assessment_web=65.0,
                assessment_stats=82.0,
                assessment_aptitude=88.0
            )
            db.add(demo_profile)
            db.commit()
    finally:
        db.close()

# Seed default demo user immediately
seed_default_demo_user()

@app.get("/")
def root():
    return {
        "app": "CareerAI API",
        "status": "online",
        "docs_url": "/docs",
        "version": settings.VERSION
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
