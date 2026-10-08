"""
Machine Learning Training Pipeline for CareerAI.
Executes end-to-end training, data validation, model comparisons,
evaluation metric calculation, and joblib artifact persistence.
"""

import os
import json
import logging
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, RandomForestRegressor, GradientBoostingRegressor

from ml.features.skill_taxonomy import ROLES, ALL_TRACKED_SKILLS
from ml.preprocessing.pipeline import CareerFeatureProcessor
from ml.data.dataset_generator import generate_synthetic_profiles, save_synthetic_dataset
from ml.evaluation.metrics import evaluate_classification_model, evaluate_regression_model

# Check if XGBoost is available
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("CareerAI-ML")

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")
DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasets")


def run_data_quality_checks(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs dataset validation, missing value auditing,
    duplicate detection, and class balance analysis.
    """
    total_samples = len(df)
    missing_counts = df.isnull().sum().to_dict()
    total_missing = int(sum(missing_counts.values()))
    duplicates_count = int(df.duplicated(subset=["candidate_id"]).sum())
    
    role_distribution = df["target_role"].value_counts().to_dict()
    
    # Calculate IQR for salary to identify outliers
    q25 = df["salary_lpa"].quantile(0.25)
    q75 = df["salary_lpa"].quantile(0.75)
    iqr = q75 - q25
    outliers_count = int(((df["salary_lpa"] < (q25 - 1.5 * iqr)) | (df["salary_lpa"] > (q75 + 1.5 * iqr))).sum())

    stats = {
        "total_records": total_samples,
        "total_features": len(df.columns),
        "total_missing_values": total_missing,
        "duplicate_records": duplicates_count,
        "outlier_salaries_count": outliers_count,
        "role_distribution": role_distribution,
        "salary_summary": {
            "mean": round(float(df["salary_lpa"].mean()), 2),
            "median": round(float(df["salary_lpa"].median()), 2),
            "std": round(float(df["salary_lpa"].std()), 2),
            "min": round(float(df["salary_lpa"].min()), 2),
            "max": round(float(df["salary_lpa"].max()), 2),
        },
        "experience_summary": {
            "mean": round(float(df["years_experience"].mean()), 2),
            "max": round(float(df["years_experience"].max()), 2)
        }
    }
    return stats


def train_and_evaluate_all(dataset_path: str = None) -> Dict[str, Any]:
    """
    Orchestrates the entire training lifecycle and saves all artifacts.
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    os.makedirs(DATASETS_DIR, exist_ok=True)

    # 1. Load or Generate Dataset
    if dataset_path is None or not os.path.exists(dataset_path):
        dataset_path = os.path.join(DATASETS_DIR, "students_career_data.csv")
        if not os.path.exists(dataset_path):
            logger.info("Dataset not found. Generating clean reproducible synthetic dataset...")
            df = save_synthetic_dataset(dataset_path, num_samples=3500)
        else:
            logger.info("Loading existing dataset from %s", dataset_path)
            df = pd.read_csv(dataset_path)
    else:
        logger.info("Loading dataset from %s", dataset_path)
        df = pd.read_csv(dataset_path)

    # 2. Data Quality Checks
    logger.info("Running dataset quality checks...")
    data_quality_stats = run_data_quality_checks(df)

    # 3. Feature Processing
    logger.info("Fitting feature engineering pipeline...")
    feature_processor = CareerFeatureProcessor()
    X = feature_processor.fit_transform(df)
    feature_names = feature_processor.feature_names_

    # 4. Target Preparation
    # A. Role Classification
    role_encoder = LabelEncoder()
    y_role_encoded = role_encoder.fit_transform(df["target_role"])
    role_labels = list(role_encoder.classes_)

    # B. Salary Regression
    y_salary = df["salary_lpa"].to_numpy()

    # Split train/test (80/20)
    X_train, X_test, y_role_train, y_role_test, y_sal_train, y_sal_test = train_test_split(
        X, y_role_encoded, y_salary, test_size=0.2, random_state=42, stratify=y_role_encoded
    )

    logger.info("Train shape: %s, Test shape: %s", X_train.shape, X_test.shape)

    # =========================================================================
    # 5. Role Classification Models Comparison
    # =========================================================================
    logger.info("--- Training Role Classification Models ---")
    clf_models = {
        "Logistic Regression (Baseline)": LogisticRegression(max_iter=1000, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=150, max_depth=16, random_state=42, n_jobs=-1),
    }

    if HAS_XGBOOST:
        clf_models["XGBoost Classifier"] = xgb.XGBClassifier(
            n_estimators=120, max_depth=6, learning_rate=0.1, random_state=42, eval_metric="mlogloss"
        )
    else:
        clf_models["Gradient Boosting Classifier"] = GradientBoostingClassifier(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
        )

    clf_evaluations: List[Dict[str, Any]] = []
    best_clf_name = ""
    best_clf_f1 = -1.0
    best_clf_model = None

    for name, model in clf_models.items():
        logger.info("Training %s...", name)
        model.fit(X_train, y_role_train)
        y_pred = model.predict(X_test)
        
        # Decode for metrics
        y_test_decoded = role_encoder.inverse_transform(y_role_test)
        y_pred_decoded = role_encoder.inverse_transform(y_pred)
        
        metrics = evaluate_classification_model(name, y_test_decoded, y_pred_decoded, role_labels)
        clf_evaluations.append(metrics)
        logger.info("%s -> Accuracy: %.4f, F1: %.4f", name, metrics["accuracy"], metrics["f1_score"])

        if metrics["f1_score"] > best_clf_f1:
            best_clf_f1 = metrics["f1_score"]
            best_clf_name = name
            best_clf_model = model

    logger.info("Best Classification Model Selected: %s (F1: %.4f)", best_clf_name, best_clf_f1)

    # Feature Importance for best classifier
    clf_feature_importances: List[Dict[str, Any]] = []
    if hasattr(best_clf_model, "feature_importances_"):
        raw_importances = best_clf_model.feature_importances_
        sorted_idx = np.argsort(raw_importances)[::-1]
        for idx in sorted_idx[:20]:
            clf_feature_importances.append({
                "feature": feature_names[idx],
                "importance": round(float(raw_importances[idx]), 4)
            })
    elif hasattr(best_clf_model, "coef_"):
        # Mean absolute coefficient across all classes
        raw_importances = np.mean(np.abs(best_clf_model.coef_), axis=0)
        sorted_idx = np.argsort(raw_importances)[::-1]
        for idx in sorted_idx[:20]:
            clf_feature_importances.append({
                "feature": feature_names[idx],
                "importance": round(float(raw_importances[idx]), 4)
            })

    # =========================================================================
    # 6. Salary Regression Models Comparison
    # =========================================================================
    logger.info("--- Training Salary Regression Models ---")
    reg_models = {
        "Linear Regression (Baseline)": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=120, max_depth=14, random_state=42, n_jobs=-1),
    }

    if HAS_XGBOOST:
        reg_models["XGBoost Regressor"] = xgb.XGBRegressor(
            n_estimators=120, max_depth=6, learning_rate=0.08, random_state=42
        )
    else:
        reg_models["Gradient Boosting Regressor"] = GradientBoostingRegressor(
            n_estimators=120, max_depth=5, learning_rate=0.08, random_state=42
        )

    reg_evaluations: List[Dict[str, Any]] = []
    best_reg_name = ""
    best_reg_r2 = -999.0
    best_reg_model = None

    for name, model in reg_models.items():
        logger.info("Training %s...", name)
        model.fit(X_train, y_sal_train)
        y_pred = model.predict(X_test)
        metrics = evaluate_regression_model(name, y_sal_test, y_pred)
        reg_evaluations.append(metrics)
        logger.info("%s -> MAE: %.4f LPA, RMSE: %.4f LPA, R2: %.4f", name, metrics["mae"], metrics["rmse"], metrics["r2_score"])

        if metrics["r2_score"] > best_reg_r2:
            best_reg_r2 = metrics["r2_score"]
            best_reg_name = name
            best_reg_model = model

    logger.info("Best Regression Model Selected: %s (R2: %.4f)", best_reg_name, best_reg_r2)

    # Feature Importance for best regressor
    reg_feature_importances: List[Dict[str, Any]] = []
    if hasattr(best_reg_model, "feature_importances_"):
        raw_reg_importances = best_reg_model.feature_importances_
        sorted_reg_idx = np.argsort(raw_reg_importances)[::-1]
        for idx in sorted_reg_idx[:20]:
            reg_feature_importances.append({
                "feature": feature_names[idx],
                "importance": round(float(raw_reg_importances[idx]), 4)
            })
    elif hasattr(best_reg_model, "coef_"):
        raw_reg_importances = np.abs(best_reg_model.coef_)
        sorted_reg_idx = np.argsort(raw_reg_importances)[::-1]
        for idx in sorted_reg_idx[:20]:
            reg_feature_importances.append({
                "feature": feature_names[idx],
                "importance": round(float(raw_reg_importances[idx]), 4)
            })

    # =========================================================================
    # 7. Model Artifacts Persistence
    # =========================================================================
    logger.info("Saving trained models and preprocessor pipelines...")
    joblib.dump(best_clf_model, os.path.join(ARTIFACTS_DIR, "best_role_classifier.joblib"))
    joblib.dump(best_reg_model, os.path.join(ARTIFACTS_DIR, "best_salary_regressor.joblib"))
    joblib.dump(feature_processor, os.path.join(ARTIFACTS_DIR, "feature_processor.joblib"))
    joblib.dump(role_encoder, os.path.join(ARTIFACTS_DIR, "role_label_encoder.joblib"))

    full_metrics_report = {
        "data_quality": data_quality_stats,
        "classification": {
            "models_evaluated": clf_evaluations,
            "best_model_name": best_clf_name,
            "best_f1_score": round(best_clf_f1, 4),
            "top_features": clf_feature_importances,
            "classes": role_labels
        },
        "regression": {
            "models_evaluated": reg_evaluations,
            "best_model_name": best_reg_name,
            "best_r2_score": round(best_reg_r2, 4),
            "top_features": reg_feature_importances
        }
    }

    metrics_file = os.path.join(ARTIFACTS_DIR, "training_metrics.json")
    with open(metrics_file, "w") as f:
        json.dump(full_metrics_report, f, indent=2)

    logger.info("All model artifacts and evaluation metrics saved to %s", ARTIFACTS_DIR)
    return full_metrics_report


if __name__ == "__main__":
    train_and_evaluate_all()
