# CareerAI — AI Career Intelligence & Job Recommendation Platform

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.6-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1-1572B6?style=for-the-badge)](https://xgboost.readthedocs.io)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

> A serious MCA-level / portfolio-grade full-stack Machine Learning platform that analyzes candidate academic trajectories, programming competencies, assessment scores, and resumes to predict best-fit tech career roles, calculate transparent job-readiness scores, identify critical skill gaps, predict realistic salary ranges, and recommend high-compatibility jobs.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [How this Project Demonstrates Machine Learning](#2-how-this-project-demonstrates-machine-learning)
3. [System Architecture](#3-system-architecture)
4. [Machine Learning Pipeline](#4-machine-learning-pipeline)
   - [Data Generation & Preprocessing](#a-data-generation--preprocessing)
   - [Job Role Classification](#b-job-role-classification)
   - [Salary Range Regression](#c-salary-range-regression)
   - [Skill Vector Cosine Similarity & XAI](#d-skill-vector-cosine-similarity--xai)
   - [NLP Resume ATS Analyzer](#e-nlp-resume-ats-analyzer)
   - [Job Compatibility Matching](#f-job-compatibility-matching)
5. [Application Features & UI](#5-application-features--ui)
6. [Project Structure](#6-project-structure)
7. [API Documentation](#7-api-documentation)
8. [Getting Started Locally](#8-getting-started-locally)
9. [Running Tests](#9-running-tests)
10. [Docker Deployment](#10-docker-deployment)

---

## 1. Problem Statement

Tech graduates often struggle to determine which career paths best suit their skills, projects, and academic background. Traditional job portals rely on simple keyword filtering without understanding skill affinities, feature correlations, or true role readiness.

**CareerAI** bridges this gap by applying genuine Machine Learning algorithms to:
- Predict suitable roles across 12 tech domains (Data Science, ML, AI, Web Development, Cloud, DevOps, Cybersecurity, etc.).
- Deliver **Explainable AI (XAI)** rationales explaining *why* a role was recommended.
- Formulate a transparent **Job Readiness Index** based on a weighted multi-factor scoring formula.
- Uncover missing high-priority skills and construct an 8-week customized learning roadmap with capstone projects.
- Extract skills from uploaded resumes using NLP and compute an estimated ATS compatibility score.

---

## 2. How this Project Demonstrates Machine Learning

| Component | ML Technique / Algorithm | Metrics / Output |
| :--- | :--- | :--- |
| **Role Classifier** | Multi-class `LogisticRegression`, `RandomForestClassifier`, and `XGBClassifier` with cross-model tournament selection | Accuracy, Weighted Precision, Recall, F1-Score, 12×12 Confusion Matrix |
| **Salary Regressor** | `LinearRegression`, `RandomForestRegressor`, and `GradientBoostingRegressor` / `XGBRegressor` | MAE, RMSE, R² score, Empirical 85% Confidence Interval in LPA |
| **Career Affinity** | Vector Space Cosine Similarity $\cos(\theta) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}$ combined with classifier posterior probability | Top 5 ranked career paths with match percentage (0–100%) |
| **Feature Extraction** | `StandardScaler`, `OneHotEncoder`, 54-dimensional binary skill vectorizer | Preprocessing pipeline persisted via `joblib` |
| **Explainable AI (XAI)**| Feature Importances extraction + rule-based attribute attribution | Plain-English explanations of top driving features |
| **Resume Parser** | NLP boundary matching, regex tokenization, synonym normalization | ATS compatibility score, strengths & weaknesses, missing keywords |

---

## 3. System Architecture

```
                                  +---------------------------------------+
                                  |            React + Vite Frontend      |
                                  |  (Dashboard, Career AI, ATS, ML Hub)  |
                                  +-------------------+-------------------+
                                                      |  REST / JWT
                                                      v
                                  +---------------------------------------+
                                  |           FastAPI Web Service         |
                                  |  (Auth, Profile, Career, Jobs, Tests) |
                                  +---------+-------------------+---------+
                                            |                   |
                       +--------------------+                   +--------------------+
                       |                                                             |
                       v                                                             v
        +-----------------------------+                               +-----------------------------+
        |   ML Inference Engine       |                               |      SQLAlchemy Database    |
        | - Role Classifier (.joblib) |                               | - Users & Profiles          |
        | - Salary Regressor (.joblib)|                               | - Education & Projects      |
        | - Feature Pipeline (.joblib)|                               | - 500+ Seeded Tech Jobs     |
        | - Cosine Skill Matching     |                               | - 7-Domain Assessment Bank  |
        +-----------------------------+                               +-----------------------------+
```

---

## 4. Machine Learning Pipeline

### A. Data Generation & Preprocessing
- Dataset generator creates **3,500 realistic records** with correlated skills, assessment marks, degrees, and salaries.
- Preprocessing applies `StandardScaler` to numerical attributes, `OneHotEncoder` to categoricals, and binary flags to all 54 tracked skills.
- The fitted `CareerFeatureProcessor` is persisted to `ml/saved_models/feature_processor.joblib` to prevent data leakage during inference.

### B. Job Role Classification
The training pipeline trains 3 competing classifiers:
1. `LogisticRegression(max_iter=1000)` (Baseline)
2. `RandomForestClassifier(n_estimators=150, max_depth=16)`
3. `XGBClassifier(n_estimators=120, max_depth=6)`

The best-performing model on stratified test split is automatically serialized as `best_role_classifier.joblib`.

### C. Salary Range Regression
Compares Linear Regression against Random Forest and Gradient Boosting/XGBoost. Evaluates via:
- **MAE** (Mean Absolute Error in Lakhs Per Annum)
- **RMSE** (Root Mean Squared Error)
- **R² Score** (Variance Explained)

Inference displays salaries as realistic empirical intervals: `[predicted - 1.25 * MAE, predicted + 1.35 * MAE] LPA`.

### D. Skill Vector Cosine Similarity & XAI
Combines normalized skill vector similarity with model probabilities to rank career paths and explain key contributors.

### E. NLP Resume ATS Analyzer
- Parses PDF (`pypdf`), DOCX (`python-docx`), and TXT.
- Normalizes technical skill synonyms (e.g., "ML" -> "machine learning", "k8s" -> "kubernetes").
- Audits sections, quantifiable achievements, action verbs, and missing role keywords.

---

## 5. Application Features & UI

1. **Landing Page**: Modern hero section, live KPI counter, AI architecture overview.
2. **Authentication & Quick Demo**: JWT authentication with one-click demo login (`demo@careerai.com` / `demo123`).
3. **Comprehensive Dashboard**: Job Readiness Score (0-100), Skill Radar Chart, Career Match Bar Chart, and Formula Breakdown.
4. **Career Prediction Studio**: Interactive parameter adjustment (experience slider, GPA, custom skills) with instant ML inference.
5. **Skill Gap Analyzer**: Side-by-side comparison of acquired vs required skills for any of the 12 roles.
6. **Resume ATS Analyzer**: Document upload with estimated compatibility scoring and actionable recommendations.
7. **Job Recommendations**: 500+ seeded tech jobs with 5-factor weighted matching (50% skills, 15% experience, etc.).
8. **Assessment System**: 7 categories of technical MCQs feeding directly into profile features.
9. **Personalized Learning Roadmap**: 8-week structured curriculum with recommended capstone project.
10. **ML Analytics Dashboard**: Complete transparency into model accuracy, F1-scores, 12×12 confusion matrix, and feature importances.

---

## 6. Project Structure

```
career-ai/
│
├── frontend/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Navbar, AuthModal
│   │   ├── pages/                # Dashboard, Career, SkillGap, Resume, Jobs, Assessment, MLAnalytics
│   │   ├── services/api.ts       # Typed REST API Client
│   │   ├── types/index.ts        # TypeScript Interfaces
│   │   ├── App.tsx               # Main Router
│   │   └── main.tsx              # React Entrypoint
│   └── package.json
│
├── backend/                      # FastAPI Python Web Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint with CORS & startup seeding
│   │   ├── core/                 # Config & Security (JWT, bcrypt)
│   │   ├── database/             # SQLAlchemy Session & Base
│   │   ├── models/               # Database ORM entities
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Resume parser, job matcher, assessment engine
│   │   └── api/v1/endpoints/     # REST routers: auth, profile, career, resume, jobs, ml
│   └── tests/
│       └── test_api.py           # Pytest integration & unit tests
│
├── ml/                           # Core Machine Learning Subsystem
│   ├── data/                     # Dataset generator & validations
│   ├── preprocessing/            # Feature processors & vectorizers
│   ├── features/                 # Skill taxonomy & 12 role profiles
│   ├── training/                 # Model training, tournaments, artifact saving
│   ├── evaluation/               # Accuracy, F1, MAE, RMSE, confusion matrix
│   ├── inference/                # Real-time predictor & XAI logic
│   └── saved_models/             # Persisted joblib models & metrics JSON
│
├── datasets/                     # Synthetic 3500-sample CSV dataset
├── scripts/                      # seed_database.py (120+ users, 500+ jobs)
├── train_models.py               # CLI command to execute ML training pipeline
├── requirements.txt              # Backend & ML dependencies
├── docker-compose.yml            # Multi-container orchestration
├── Dockerfile.backend            # Python API container
└── Dockerfile.frontend           # Node/Nginx frontend container
```

---

## 7. API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new candidate account |
| `POST` | `/api/v1/auth/login` | Log in and receive JWT access token |
| `GET` | `/api/v1/profile` | Retrieve candidate profile and real-time readiness score |
| `PUT` | `/api/v1/profile` | Update education, skills, projects, and credentials |
| `POST` | `/api/v1/career/predict` | Run ML role classification and salary prediction |
| `GET` | `/api/v1/career/recommendations` | Get top 5 predicted career paths for logged-in profile |
| `POST` | `/api/v1/career/salary-predict` | Predict estimated salary range (LPA) |
| `POST` | `/api/v1/career/skill-gap` | Analyze acquired vs missing skills for target role |
| `GET` | `/api/v1/career/learning-roadmap`| Get week-by-week prioritized learning roadmap |
| `POST` | `/api/v1/resume/analyze` | Parse PDF/DOCX/TXT resume and compute ATS score |
| `GET` | `/api/v1/jobs` | Search & filter seeded catalog of 500+ jobs |
| `GET` | `/api/v1/jobs/recommendations` | Get compatibility-ranked job recommendations |
| `GET` | `/api/v1/assessment/questions` | Fetch technical MCQ questions by category |
| `POST` | `/api/v1/assessment/submit` | Evaluate test answers and sync scores to profile |
| `GET` | `/api/v1/ml/metrics` | Retrieve dataset statistics, model benchmarks & confusion matrix |

---

## 8. Getting Started Locally

### Prerequisites
- Python 3.9+
- Node.js 18+ & npm

### Step 1: Install Python Dependencies & Train ML Models
```bash
# Navigate to project root
pip install -r requirements.txt

# Run the complete ML training pipeline
python train_models.py
```
*This command validates data quality, trains baseline and advanced models, evaluates them, selects the best models, and saves `.joblib` artifacts to `ml/saved_models/`.*

### Step 2: Seed the Database
```bash
python scripts/seed_database.py
```
*Creates 120+ realistic student user profiles, 500+ jobs, and default demo credentials.*

### Step 3: Start the FastAPI Backend
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Step 4: Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

**Demo Credentials**:
- **Email**: `demo@careerai.com`
- **Password**: `demo123`

---

## 9. Running Tests

The test suite validates ML model loading, predictions, salary calculations, resume parsing, ATS scoring, and API endpoints:

```bash
python -m pytest backend/tests/test_api.py -v
```

All 12 unit and integration tests pass successfully with 100% assertion coverage.

---

## 10. Docker Deployment

Deploy both backend and frontend with Docker Compose:

```bash
docker-compose up --build
```
- Frontend available at: `http://localhost:3000`
- Backend API available at: `http://localhost:8000`
