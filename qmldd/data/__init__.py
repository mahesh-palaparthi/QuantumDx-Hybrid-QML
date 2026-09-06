from .base import Dataset, DataLoader
from .loaders import BreastCancerLoader, HeartDiseaseLoader, DiabetesLoader, EarlyStageDiabetesLoader

DATA_LOADERS: dict[str, type[DataLoader]] = {
    "breast_cancer": BreastCancerLoader,
    "heart_disease": HeartDiseaseLoader,
    "diabetes": DiabetesLoader,
    "early_stage_diabetes": EarlyStageDiabetesLoader,
}

__all__ = ["Dataset", "DataLoader", "DATA_LOADERS"]

