# ⚛️ QuantumDx — Hybrid Quantum-Classical ML Early Disease Detection Platform

> **Early Disease Detection Platform • Hybrid Quantum Machine Learning**  
> *Developed for the Smart India Hackathon (SIH)**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/ML%20Engine-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Gateway-Node.js%20Express-339933?logo=node.js)](https://nodejs.org/)
[![PennyLane](https://img.shields.io/badge/Quantum%20Backend-PennyLane-ffd21e?logo=pennylane)](https://pennylane.ai/)
[![scikit-learn](https://img.shields.io/badge/Classical%20ML-scikit--learn-f7931e?logo=scikit-learn)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Key Platform Innovations

### 1. ⚛️ 4-Qubit QSVM ZZ Feature Map Circuit Explorer
- Interactive visualizer for the authentic **Havlíček et al. (Nature 2019)** ZZ Feature Map state-preparation ansatz:
  $$U_{\Phi(\mathbf{x})} = \big[U_{\Phi(\mathbf{x})} H^{\otimes 4}\big]^2$$
- Maps real patient clinical features into exact rotation angles in real-time:
  - **Single-qubit phase rotations:** $\phi_i = 2 \cdot x_i$ radians on $R_z$ gates
  - **Two-qubit $ZZ$ entangling interactions:** $\phi_{ij} = 2 \cdot (\pi - x_i)(\pi - x_j)$ radians on $R_{zz}$ gates
- Interactive gate inspector displaying Bloch sphere rotations, radians, degrees, and clinical feature sources.

### 2. 📋 Verified Real Patient Row Picker (Zero Synthetic Data)
- Replaces synthetic demo randomization with direct row-indexed cases from authentic clinical datasets:
  - **Early Stage Diabetes:** 251 real patient records (*Sylhet Diabetes Hospital, Bangladesh*).
  - **Breast Cancer:** 569 fine needle aspirate biopsy cases (*UCI Wisconsin Diagnostic FNA*).
  - **Heart Disease:** 270 clinical hemodynamic patient records (*Statlog Cleveland Clinic*).
- Surfaces exact dataset row index (e.g. `Row #14`) and published ground-truth diagnosis.
- **Ground-Truth Match Verification:** Confirms model predictions against the authentic dataset label (`100% Match Confirmed ✅`).

### 3. 🛡️ Risk-Stratification Semicircular Arc Gauge Meter
- Dynamic SVG radial arc gauge with smooth animated needle.
- Color-coded triage zones:
  - **Low Risk (0–40%):** Emerald Green (`#10b981`) — Healthy Baseline
  - **Moderate Risk (40–65%):** Amber Warning (`#f59e0b`) — Clinical Monitoring
  - **High Risk (65–100%):** Crimson Red (`#ef4444`) — Priority 1 Triage
  - **Divergence / Deadband:** Violet Indigo (`#a855f7`) — Inconclusive / Laboratory Review

### 4. 🌐 Frosted Glassmorphism & Bio-Scan Radar Background
- Cohesive dark UI with frosted glass cards (`backdrop-filter: blur(16px)`).
- HTML5 Canvas background with drifting quantum entanglement nodes, concentric probability waves, and a rotating bio-scan sweep line (capped at 60fps, auto-pauses when tab is hidden).
- Interactive 3D Portal landing screen featuring a real-time rotating 3D Bloch sphere.

### 5. 🔐 Zero-Cloud PBKDF2 Clinical Authentication
- Standalone offline authentication with role-based workflows for **Patients**, **Researchers**, and **Doctors**.
- 100,000 iterations PBKDF2 password hashing with local database persistence (`backend/data/quantumdx_db.json`).

---

## 🏛️ System Architecture

```
[React Frontend (Vite, Port 5174)]
      │
      ├── 1. Verified Patient Picker: Select authentic dataset row index or random case
      │
      ├── 2. Node.js Gateway (Port 5000): Authentication, Database & Sample proxy
      │      │
      │      └── 3. Python FastAPI Engine (Port 8000):
      │             ├── Classical Tuned SVM / Deep MLP / Logistic Regression
      │             └── PennyLane Quantum Simulator:
      │                 ├── QSVM (ZZ Feature Map Kernel)
      │                 └── 4-Qubit Variational Quantum Classifier (QVQC) / QNN
      │
      ├── 4. Dual Consensus Matrix & Safety Gating (Harmonic Mean & Deadband Check)
      │
      ├── 5. Risk-Stratification Arc Gauge & Real-Time Dynamic XAI Bar Attributions
      │
      └── 6. 4-Qubit QSVM ZZ Feature Map Circuit Explorer Tab
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/mahesh-palaparthi/QuantumDx-Hybrid-QML.git
cd QuantumDx-Hybrid-QML
```

### 2. Set Up Python Quantum-ML Engine
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI engine (Port 8000)
python -m uvicorn python_api:app --host 127.0.0.1 --port 8000
```

### 3. Set Up Node.js Gateway Server
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:5000
```

### 4. Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev
# Vite runs on http://localhost:5174/ (or 5173)
```

Open your browser and navigate to **`http://localhost:5174/`** to experience the full platform.

---

## 🔬 Benchmark Performance & Validation

| Condition / Dataset | Classical Model | Classical Acc | Classical Sens | Quantum Model | Quantum Acc | Quantum ROC-AUC |
|---|---|---|---|---|---|---|
| **Early Stage Diabetes** (*Sylhet*) | Tuned SVM (RBF) | **94.00%** | **98.57%** | QNN (4 Qubits) | **81.30%** | **91.43%** |
| **Breast Cancer** (*UCI Diagnostic*) | Deep MLP | **98.24%** | **98.50%** | QVQC (4 Qubits) | **94.74%** | **97.40%** |
| **Heart Disease** (*Statlog Cleveland*) | Logistic Regression | **88.24%** | **89.50%** | QVQC (4 Qubits) | **82.35%** | **88.60%** |

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
