import json
import time
from pathlib import Path
import pandas as pd

from qmldd.data import DATA_LOADERS
from qmldd.pipeline import run_on_dataset
from qmldd.validation import check_class_balance, clip_n_components

print("--- 1. Loading and Inspecting Dataset via EarlyStageDiabetesLoader ---")
dataset = DATA_LOADERS["early_stage_diabetes"]().load()
print(f"Loaded dataset: {dataset.X.shape[0]} unique rows, {dataset.X.shape[1]} clinical features")
print(f"Feature names: {dataset.feature_names}")

warnings = check_class_balance(dataset)
for w in warnings:
    print("Warning:", w)

n_components, clip_warnings = clip_n_components(dataset, 4)
for w in clip_warnings:
    print("Warning:", w)

config = {
    "test_size": 0.20,
    "random_state": 42,
    "preprocessing": {
        "method": "pca",
        "n_components": n_components,
    },
    "models": [
        {"type": "classical_logreg"},
        {"type": "classical_rf"},
        {"type": "classical_svm"},
        {"type": "classical_nn"},
        {
            "type": "quantum_vqc",
            "n_layers": 2,
            "epochs": 20,
            "batch_size": 32,
            "lr": 0.15,
        },
        {
            "type": "quantum_qsvm",
            "reps": 2,
            "max_train_samples": 80,
        },
        {
            "type": "quantum_qnn",
            "n_layers": 2,
            "epochs": 10,
            "batch_size": 32,
            "lr": 0.1,
        },
    ],
    "explain": True,
    "explain_samples": 15,
    "output": "results/early_stage_diabetes.json",
}

print("\n--- 3. Running Benchmark (Classical Baselines + Quantum VQC & QSVM) ---")
start_time = time.time()
output = run_on_dataset(dataset, config, verbose=True)
total_time = time.time() - start_time

print(f"\nBenchmark completed successfully in {total_time:.1f} seconds!")
print(f"Results saved to: results/early_stage_diabetes.json")
