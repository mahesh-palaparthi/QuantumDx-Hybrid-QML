from .base import Dataset, DataLoader
from .loaders import (
    BreastCancerLoader,
    HeartDiseaseLoader,
    DiabetesLoader,
    EarlyStageDiabetesLoader,
    ChildMalnutritionLoader,
)

DATA_LOADERS: dict[str, type[DataLoader]] = {
    "breast_cancer": BreastCancerLoader,
    "heart_disease": HeartDiseaseLoader,
    "diabetes": DiabetesLoader,
    "early_stage_diabetes": EarlyStageDiabetesLoader,
    "child_malnutrition": ChildMalnutritionLoader,
}

__all__ = ["Dataset", "DataLoader", "DATA_LOADERS"]

