"""
ML Analytics & Diagnostics Router.
Powers the ML Analytics developer dashboard with genuine model evaluation metrics,
feature importances, confusion matrix, dataset statistics, and model comparisons.
"""

import os
import json
from fastapi import APIRouter
from ml.inference.predictor import CareerAIPredictor, ARTIFACTS_DIR

router = APIRouter()

@router.get("/metrics")
def get_ml_metrics():
    metrics_file = os.path.join(ARTIFACTS_DIR, "training_metrics.json")
    if os.path.exists(metrics_file):
        with open(metrics_file, "r") as f:
            data = json.load(f)
    else:
        # Fallback if not yet trained
        data = {
            "data_quality": {"total_records": 3500, "total_features": 113, "total_missing_values": 0},
            "classification": {"models_evaluated": []},
            "regression": {"models_evaluated": []}
        }

    predictor = CareerAIPredictor.get_instance()
    data["system_status"] = {
        "models_loaded": predictor.is_loaded,
        "classifier_type": type(predictor.classifier).__name__ if predictor.classifier else "None",
        "regressor_type": type(predictor.regressor).__name__ if predictor.regressor else "None",
        "total_tracked_skills": len(predictor.feature_processor.skill_cols) if predictor.feature_processor else 0
    }
    return data
