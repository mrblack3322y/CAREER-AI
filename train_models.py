#!/usr/bin/env python
"""
CareerAI — Model Training CLI Entrypoint.
Executes the full pipeline:
  Data generation / loading -> Validation -> Feature Engineering ->
  Baseline & Advanced Model Training -> Rigorous Evaluation ->
  Model Selection -> Artifact Persistence.
"""

import sys
import os

# Add project root to python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ml.training.trainer import train_and_evaluate_all

def main():
    print("=" * 65)
    print("  CareerAI — Machine Learning Pipeline & Model Training")
    print("=" * 65)
    
    metrics = train_and_evaluate_all()
    
    print("\n" + "=" * 65)
    print("  TRAINING COMPLETE — MODEL SELECTION SUMMARY")
    print("=" * 65)
    print(f"Dataset Records: {metrics['data_quality']['total_records']}")
    print(f"Best Role Classifier: {metrics['classification']['best_model_name']}")
    print(f"Classifier F1-Score: {metrics['classification']['best_f1_score']:.4f}")
    print(f"Best Salary Regressor: {metrics['regression']['best_model_name']}")
    print(f"Regressor R2-Score: {metrics['regression']['best_r2_score']:.4f}")
    print("=" * 65)
    print("Artifacts saved to: ml/saved_models/")

if __name__ == "__main__":
    main()
