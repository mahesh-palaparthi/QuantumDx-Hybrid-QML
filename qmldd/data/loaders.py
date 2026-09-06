from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.datasets import fetch_openml, load_breast_cancer

from .base import Dataset, DataLoader
from .custom import build_dataset_from_dataframe


def _binarize_exact(labels, positive_value: str) -> np.ndarray:
    """Map a categorical target to 0/1 by exact match against positive_value."""
    return (np.asarray(labels).astype(str) == positive_value).astype(int)


class BreastCancerLoader(DataLoader):
    """UCI Breast Cancer Wisconsin (Diagnostic), bundled with scikit-learn."""

    name = "breast_cancer"

    def load(self) -> Dataset:
        data = load_breast_cancer()
        # sklearn convention is 0=malignant, 1=benign; flip so 1=disease-positive.
        y = 1 - data.target
        return Dataset(
            name=self.name,
            X=data.data.astype(float),
            y=y,
            feature_names=list(data.feature_names),
            positive_label="malignant",
            negative_label="benign",
        )


class HeartDiseaseLoader(DataLoader):
    """Statlog Heart dataset (Cleveland-derived), fetched from OpenML."""

    name = "heart_disease"

    def load(self) -> Dataset:
        frame = fetch_openml(name="heart-statlog", version=1, as_frame=True)
        df = frame.frame.copy()
        target_col = frame.target_names[0]
        y = _binarize_exact(df[target_col], positive_value="present")
        X = df.drop(columns=[target_col]).astype(float)
        return Dataset(
            name=self.name,
            X=X.to_numpy(),
            y=y,
            feature_names=list(X.columns),
            positive_label="heart_disease_present",
            negative_label="heart_disease_absent",
        )


class DiabetesLoader(DataLoader):
    """Pima Indians Diabetes dataset, fetched from OpenML."""

    name = "diabetes"

    def load(self) -> Dataset:
        frame = fetch_openml(name="diabetes", version=1, as_frame=True)
        df = frame.frame.copy()
        target_col = "class"
        y = _binarize_exact(df[target_col], positive_value="tested_positive")
        X = df.drop(columns=[target_col]).astype(float)
        return Dataset(
            name=self.name,
            X=X.to_numpy(),
            y=y,
            feature_names=list(X.columns),
            positive_label="diabetic",
            negative_label="non_diabetic",
        )


class EarlyStageDiabetesLoader(DataLoader):
    """Early Stage Diabetes Risk Prediction Dataset (251 unique patient profiles, 16 symptoms)."""

    name = "early_stage_diabetes"

    def load(self) -> Dataset:
        csv_path = Path(__file__).resolve().parent.parent.parent / "data" / "early_stage_diabetes.csv"
        df = pd.read_csv(csv_path).drop_duplicates().reset_index(drop=True)

        model_data = df.copy()
        model_data["Gender"] = model_data["Gender"].map({"Male": 1, "Female": 0})
        yes_no_columns = [
            "Polyuria", "Polydipsia", "sudden weight loss", "weakness",
            "Polyphagia", "Genital thrush", "visual blurring", "Itching",
            "Irritability", "delayed healing", "partial paresis",
            "muscle stiffness", "Alopecia", "Obesity"
        ]
        for col in yes_no_columns:
            model_data[col] = model_data[col].map({"Yes": 1, "No": 0})

        y = model_data["class"].map({"Positive": 1, "Negative": 0}).to_numpy(dtype=int)
        feature_cols = [c for c in model_data.columns if c != "class"]
        X = model_data[feature_cols].to_numpy(dtype=float)

        return Dataset(
            name=self.name,
            X=X,
            y=y,
            feature_names=feature_cols,
            positive_label="Positive",
            negative_label="Negative",
        )

