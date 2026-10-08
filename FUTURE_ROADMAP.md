# CareerAI — Product Roadmap & Architecture Evolution (MVP vs. V2)

This document delineates the boundaries between the currently implemented **MVP (Minimum Viable Product)** and the planned **V2 / Enterprise Scale** architecture, as defined in Section 24 of the product specification.

---

## 1. Scope Comparison Matrix

| Domain | Implemented in MVP | Planned in V2 (Production Scale) |
|---|---|---|
| **Target Job Roles** | **8 Core Tech Specializations**: Data Analyst, Data Scientist, ML Engineer, Backend Dev, Frontend Dev, Full Stack Dev, DevOps Engineer, Business Analyst. | **15+ Roles**: Cloud Architect, Cybersecurity Analyst, MLOps Engineer, Product Manager, Mobile Developer (iOS/Android), UI/UX Designer. |
| **ML Classification** | Tournament between **Logistic Regression** and **Random Forest Classifier** (`scikit-learn`), automated selection based on weighted F1 score, serialized via `joblib`. | Multi-class **XGBoost / LightGBM**, deep neural network classifiers, ensemble stacking, and dynamic model versioning with MLflow. |
| **Salary Prediction** | Tournament between **Linear Regression** and **Random Forest Regressor**, MAE/RMSE/R² evaluation, bounded confidence intervals with empirical spread. | Quantile Regression, Gradient Boosting with regional cost-of-living adjustments, real-time levels.fyi API calibration. |
| **ML Explainability** | Feature weight visualization, rule-based reasoning, top positive/negative contributing signals, confusion matrix inspector. | **SHAP (SHapley Additive exPlanations)** values, LIME local surrogates, dynamic waterfall plots. |
| **Skill Taxonomy** | 54 standardized technical skills with canonical alias normalization dictionary (`ml/features/skill_taxonomy.py`). | 500+ skills with automated taxonomy crawling, hierarchy graph (O*NET / ESCO alignment), fuzzy Levenshtein & Soundex matching. |
| **Skill Gap Analysis** | Deterministic role-to-skill matrix comparison with importance weighting (Critical / High / Medium) and prioritized learning order. | Graph-based prerequisite learning dependency chains, personalized time-to-acquire estimations based on user velocity. |
| **Resume Parser** | Pure Python extraction for **PDF, DOCX, TXT**, regex contact extraction, normalized skill dictionary scanning, ATS compatibility scoring (0–100). | OCR for image-based PDFs (Tesseract), NER (Named Entity Recognition via Fine-tuned spaCy / LayoutLM), semantic experience timeline reconstruction. |
| **Semantic Matching** | Cosine similarity on binary/TF-IDF skill vectors with role vector representations. | **Sentence Transformers (`all-MiniLM-L6-v2`)**, dense vector embeddings, vector database retrieval (pgvector / Chroma / Pinecone). |
| **Assessment System** | Curated 24-question MCQ assessment covering Python, SQL, Machine Learning, and Statistics with score tracking and readiness integration. | Adaptive testing (Item Response Theory), dynamic question bank with 250+ questions, live coding runner sandbox (Judge0). |
| **Job Recommendations**| 150 seeded realistic industry jobs across 15 tech firms; 5-factor weighted scoring (Skills 50%, Exp 15%, Edu 10%, Certs 10%, Projects 10%, Assessment 5%). | Live job aggregation APIs (Adzuna, RemoteOK, LinkedIn API integrations), user application tracking (Kanban board), email job alerts. |
| **Learning Roadmaps** | 4-phase sequential milestone generator (Foundations, Core, Practical Projects, Production & Specialization) with curated open resources. | Interactive curriculum builder, integration with Coursera / YouTube / GitHub learning repos, calendar synchronization. |
| **Architecture & DB** | FastAPI + SQLAlchemy (SQLite for instant zero-dependency local runs, switchable to PostgreSQL via `.env`), React 19 + TypeScript + Tailwind CSS. | Microservices (Auth, ML Inference, Parsing Worker), Celery + Redis task queue, PostgreSQL + pgvector, Docker Swarm / Kubernetes. |

---

## 2. MVP Architecture Overview

```text
                                 [ User Browser ]
                                        │
                         React 19 + TypeScript + Tailwind
                                        │
                                 REST API (JSON)
                                        │
                                        ▼
                            [ FastAPI Application ]
                        ├── Core Security & JWT Auth
                        ├── Dashboard Aggregation Service
                        ├── Resume Parser (PDF/DOCX/TXT)
                        ├── Job Matching Engine
                        └── Assessment Evaluation Service
                                 │              │
                                 ▼              ▼
                     [ SQLite / PostgreSQL ]   [ ML Inference Engine ]
                     ├── Users & Profiles      ├── CareerFeatureProcessor
                     ├── Assessment Results    ├── Best Role Classifier (Joblib)
                     └── Seeded Jobs (150)     ├── Best Salary Regressor (Joblib)
                                               ├── Skill Vector Similarity
                                               └── Readiness Formula Engine
```

### Key Principles Enforced in MVP:
1. **Zero Fake ML**: Real classifiers and regressors are trained on synthetic baseline datasets, evaluated with confusion matrices and R² metrics, saved to disk, and loaded during runtime inference.
2. **Deterministic Fallbacks**: Clear, reproducible outputs that students and evaluators can verify without non-deterministic LLM hallucinations.
3. **Transparent Readiness Formula**:
   $$\text{Readiness} = 0.30(\text{Skills}) + 0.20(\text{Assessment}) + 0.15(\text{Projects}) + 0.15(\text{Resume}) + 0.10(\text{Experience}) + 0.10(\text{Certs})$$
   Configurable centrally in `ml/inference/predictor.py`.

---

## 3. Transition Strategy to V2

When moving from this portfolio-ready MVP to a full production deployment:

1. **Replace Synthetic Dataset with Real Benchmark**:
   - Ingest Kaggle / IT Salary Survey datasets directly into `data/raw/` and rerun `python train_models.py`.
   - The `CareerFeatureProcessor` is designed to adapt to any tabular dataset matching the feature schema.
2. **Add Background Processing for Bulk Resumes**:
   - Wrap `resume_service.py` in Celery or FastAPI Background Tasks to handle large multi-page PDF document batches.
3. **Introduce Dense Embeddings**:
   - Add a `sentence-transformers` embedding step in `ml/inference/predictor.py` to compare project descriptions directly against job requirements using cosine similarity over 384-dimensional dense vectors.
4. **Deploy Containerized Infrastructure**:
   - Use the included `docker-compose.yml` to spin up PostgreSQL, Redis, FastAPI, and Nginx in production environments.
