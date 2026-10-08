"""
Model Evaluation and Metrics Computation for CareerAI.
Calculates rigorous metrics for classification (roles) and regression (salary),
formatting them for persistent storage and the ML Analytics dashboard.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

def evaluate_classification_model(
    model_name: str,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    labels: List[str]
) -> Dict[str, Any]:
    """
    Evaluates role classification model with accuracy, precision, recall, F1,
    and formatted confusion matrix.
    """
    acc = float(accuracy_score(y_true, y_pred))
    prec = float(precision_score(y_true, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_true, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_true, y_pred, average="weighted", zero_division=0))
    
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    
    # Detailed per-class report
    clf_report = classification_report(y_true, y_pred, labels=labels, output_dict=True, zero_division=0)
    
    return {
        "model_name": model_name,
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "labels": labels,
            "matrix": cm.tolist()
        },
        "per_class_metrics": {
            lbl: {
                "precision": round(clf_report.get(lbl, {}).get("precision", 0.0), 4),
                "recall": round(lbl_data.get("recall", 0.0), 4) if (lbl_data := clf_report.get(lbl)) else 0.0,
                "f1_score": round(lbl_data.get("f1-score", 0.0), 4) if (lbl_data := clf_report.get(lbl)) else 0.0,
                "support": int(lbl_data.get("support", 0)) if (lbl_data := clf_report.get(lbl)) else 0
            }
            for lbl in labels
        }
    }


def evaluate_regression_model(
    model_name: str,
    y_true: np.ndarray,
    y_pred: np.ndarray
) -> Dict[str, Any]:
    """
    Evaluates salary prediction model with MAE, RMSE, and R2.
    """
    mae = float(mean_absolute_error(y_true, y_pred))
    mse = float(mean_squared_error(y_true, y_pred))
    rmse = float(np.sqrt(mse))
    r2 = float(r2_score(y_true, y_pred))
    
    residuals = (y_true - y_pred).tolist()
    
    return {
        "model_name": model_name,
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2, 4),
        "sample_count": len(y_true),
        "mean_actual": round(float(np.mean(y_true)), 2),
        "mean_predicted": round(float(np.mean(y_pred)), 2)
    }
