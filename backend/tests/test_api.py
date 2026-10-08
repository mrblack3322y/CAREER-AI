"""
Comprehensive Test Suite for CareerAI:
Unit tests and integration tests covering ML models, API endpoints,
auth, resume parsing, job recommendations, and assessment engine.
"""

import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from ml.inference.predictor import CareerAIPredictor
from backend.app.services.resume_service import extract_skills_from_text, analyze_resume_text
from backend.app.services.job_service import JobRecommendationEngine
from backend.app.services.assessment_service import AssessmentEngine

client = TestClient(app)

def test_ml_predictor_loaded():
    """Verify ML predictor loaded models successfully."""
    predictor = CareerAIPredictor.get_instance()
    assert predictor.is_loaded is True
    assert predictor.classifier is not None
    assert predictor.regressor is not None

def test_career_prediction_logic():
    """Verify career predictions return top roles with reasonable percentages."""
    predictor = CareerAIPredictor.get_instance()
    results = predictor.predict_career_recommendations({
        "skills": ["python", "sql", "pandas", "machine learning", "scikit-learn"],
        "years_experience": 1.0,
        "projects_count": 2
    }, top_k=5)
    assert len(results) == 5
    top_role = results[0]["role"]
    assert top_role in ["Data Scientist", "Data Analyst", "Machine Learning Engineer"]
    assert results[0]["match_percentage"] > 50.0

def test_salary_regression_prediction():
    """Verify salary regressor returns realistic range."""
    predictor = CareerAIPredictor.get_instance()
    salary = predictor.predict_salary_range({
        "skills": ["python", "sql"],
        "years_experience": 2.0,
        "target_role": "Backend Developer",
        "location": "Bangalore"
    })
    assert "min_lpa" in salary
    assert "max_lpa" in salary
    assert salary["min_lpa"] < salary["max_lpa"]
    assert salary["predicted_median_lpa"] > 4.0

def test_skill_gap_analysis():
    """Verify skill gap engine identifies missing high priority skills."""
    predictor = CareerAIPredictor.get_instance()
    gap = predictor.analyze_skill_gap(["python", "sql"], "Data Scientist")
    assert "missing_skills" in gap
    missing_names = [m["skill"] for m in gap["missing_skills"]]
    assert "machine learning" in missing_names or "statistics" in missing_names

def test_resume_skill_extraction():
    """Verify NLP skill extraction normalizes variations."""
    sample_text = "Proficient in Python, ML, React.js, K8s, PostgreSQL and Docker with 2 years of experience."
    skills = extract_skills_from_text(sample_text)
    assert "python" in skills
    assert "machine learning" in skills  # Normalized from 'ML'
    assert "react" in skills             # Normalized from 'React.js'
    assert "kubernetes" in skills        # Normalized from 'K8s'
    assert "docker" in skills

def test_resume_analysis_ats_score():
    """Verify resume analysis returns ATS compatibility score and feedback."""
    sample_resume = """
    Jane Doe
    jane.doe@example.com | github.com/janedoe | linkedin.com/in/janedoe
    
    EDUCATION
    Master of Computer Applications (MCA) - CGPA 8.5
    
    EXPERIENCE
    Software Engineer Intern at Tech Corp
    - Engineered high-throughput REST APIs using Python, FastAPI and PostgreSQL.
    - Optimized SQL database query latency by 45% for over 50,000 active users.
    
    PROJECTS
    Career Intelligence Platform: Built with React, Tailwind CSS and Scikit-learn.
    
    SKILLS
    Python, SQL, FastAPI, PostgreSQL, Docker, Git, Machine Learning
    """
    res = analyze_resume_text(sample_resume, target_role="Backend Developer")
    assert res["ats_compatibility_score"] >= 65
    assert len(res["extracted_skills"]) >= 5
    assert res["has_quantifiable_metrics"] is True

def test_job_recommendation_engine():
    """Verify job recommendation engine returns ranked matches."""
    profile = {
        "skills": ["python", "sql", "fastapi", "docker"],
        "years_experience": 1.0,
        "location": "Bangalore"
    }
    recs = JobRecommendationEngine.get_recommendations_for_user(profile, limit=5)
    assert len(recs) == 5
    assert recs[0]["compatibility_score"] >= 40.0

def test_assessment_scoring():
    """Verify assessment scoring evaluates correct and incorrect answers."""
    submission = {
        "py_01": 0, # Correct (O(1))
        "py_02": 2, # Correct (Tuple)
        "dsa_01": 0 # Wrong
    }
    res = AssessmentEngine.evaluate_submission(submission)
    assert res["total_questions"] == 3
    assert res["correct_count"] == 2
    assert res["incorrect_count"] == 1
    assert round(res["overall_score"], 1) == 66.7

# API Integration Tests
def test_api_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_api_auth_and_login():
    # Login with seeded demo user
    response = client.post("/api/v1/auth/login", json={
        "email": "demo@careerai.com",
        "password": "demo123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@careerai.com"

def test_api_career_predict():
    response = client.post("/api/v1/career/predict", json={
        "skills": ["python", "sql", "pandas", "machine learning"],
        "years_experience": 1.0,
        "degree": "MCA"
    })
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0

def test_api_ml_metrics():
    response = client.get("/api/v1/ml/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "classification" in data
    assert "regression" in data
    assert "data_quality" in data

def test_api_dashboard():
    # Login to get JWT token
    login_res = client.post("/api/v1/auth/login", json={
        "email": "demo@careerai.com",
        "password": "demo123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Request consolidated dashboard
    headers = {"Authorization": f"Bearer {token}"}
    dash_res = client.get("/api/v1/dashboard", headers=headers)
    assert dash_res.status_code == 200
    ddata = dash_res.json()
    assert "readiness" in ddata
    assert "overall_score" in ddata["readiness"]
    assert "career_predictions" in ddata
    assert "skill_gap" in ddata
    assert "recommended_jobs" in ddata
    assert "learning_roadmap" in ddata

