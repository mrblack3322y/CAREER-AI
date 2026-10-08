"""
Feature Engineering & Preprocessing Pipeline for CareerAI.
Ensures identical transformations between training and live inference.
"""

from typing import List, Dict, Any, Tuple
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from ml.features.skill_taxonomy import ALL_TRACKED_SKILLS, normalize_skill_name

NUMERICAL_COLS = [
    "years_experience",
    "gpa",
    "certifications_count",
    "projects_count",
    "assessment_python",
    "assessment_sql",
    "assessment_ml",
    "assessment_dsa",
    "assessment_web",
    "assessment_stats",
    "assessment_aptitude",
    "soft_skills_score"
]

CATEGORICAL_COLS = ["degree", "location"]

SKILL_COLS = [f"skill_{s}" for s in ALL_TRACKED_SKILLS]


def extract_skills_vector(user_skills: List[str]) -> Dict[str, int]:
    """
    Given a raw list of user skill strings, normalizes them and
    returns a binary dictionary mapping for all tracked skill columns.
    """
    normalized_user_skills = {normalize_skill_name(s) for s in user_skills if s}
    vec = {}
    for skill in ALL_TRACKED_SKILLS:
        vec[f"skill_{skill}"] = 1 if skill in normalized_user_skills else 0
    return vec


def build_feature_dataframe(
    profile_data: Dict[str, Any],
    include_skills_vector: bool = True
) -> pd.DataFrame:
    """
    Converts a single candidate/student profile dictionary into a model-ready single-row DataFrame.
    """
    row: Dict[str, Any] = {}
    
    # Numerical
    for col in NUMERICAL_COLS:
        val = profile_data.get(col, 0.0)
        row[col] = float(val) if val is not None else 0.0
        
    # Categorical
    for col in CATEGORICAL_COLS:
        row[col] = str(profile_data.get(col, "Other"))
        
    # Skills
    if include_skills_vector:
        skills_input = profile_data.get("skills", [])
        if isinstance(skills_input, str):
            skills_input = [s.strip() for s in skills_input.split(",") if s.strip()]
        skill_vec = extract_skills_vector(skills_input)
        row.update(skill_vec)
        
    return pd.DataFrame([row])


class CareerFeatureProcessor:
    """
    Handles fitting and transforming structured candidate features.
    Saves state to avoid data leakage.
    """
    def __init__(self):
        self.numerical_cols = NUMERICAL_COLS
        self.categorical_cols = CATEGORICAL_COLS
        self.skill_cols = SKILL_COLS
        self.scaler = StandardScaler()
        self.ohe = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        self.feature_names_: List[str] = []
        self.is_fitted = False

    def fit(self, df: pd.DataFrame):
        # 1. Fit numerical scaler
        self.scaler.fit(df[self.numerical_cols].fillna(0))
        
        # 2. Fit one-hot encoder on categoricals
        self.ohe.fit(df[self.categorical_cols].fillna("Unknown"))
        
        # 3. Assemble feature names list
        cat_feature_names = list(self.ohe.get_feature_names_out(self.categorical_cols))
        self.feature_names_ = self.numerical_cols + cat_feature_names + self.skill_cols
        self.is_fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("CareerFeatureProcessor must be fitted before calling transform().")
            
        # Scaled numerical
        num_arr = self.scaler.transform(df[self.numerical_cols].fillna(0))
        
        # One-hot categoricals
        cat_arr = self.ohe.transform(df[self.categorical_cols].fillna("Unknown"))
        
        # Skills binary array
        for col in self.skill_cols:
            if col not in df.columns:
                df[col] = 0
        skill_arr = df[self.skill_cols].fillna(0).to_numpy()
        
        return np.hstack([num_arr, cat_arr, skill_arr])

    def fit_transform(self, df: pd.DataFrame) -> np.ndarray:
        return self.fit(df).transform(df)
