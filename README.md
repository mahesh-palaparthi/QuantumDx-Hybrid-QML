# ⚛️ QuantumDx — Hybrid Quantum-Classical ML Early Disease Detection Platform

> **Intelligent Clinical Screening & Diagnostic Safety Gateway Powered by Hybrid Quantum Machine Learning**  
> *Developed for Advanced Clinical Diagnostic Decision Support*

[![Live Website](https://img.shields.io/badge/Live%20Demo-quantumdx.onrender.com-0D7C7A?style=for-the-badge&logo=render)](https://quantumdx.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/mahesh-palaparthi/QuantumDx-Hybrid-QML)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/ML%20Engine-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Gateway-Node.js%20Express-339933?logo=node.js)](https://nodejs.org/)
[![PennyLane](https://img.shields.io/badge/Quantum%20Backend-PennyLane%20%2B%20Qiskit-ffd21e?logo=pennylane)](https://pennylane.ai/)
[![scikit-learn](https://img.shields.io/badge/Classical%20ML-scikit--learn-f7931e?logo=scikit-learn)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🔗 Quick Links for Evaluators
- 🌐 **Live Web Application:** [https://quantumdx.onrender.com](https://quantumdx.onrender.com)
- ⚙️ **Live Quantum-ML Engine API:** [https://quantumdx-engine.onrender.com](https://quantumdx-engine.onrender.com)
- 📂 **GitHub Repository:** [https://github.com/mahesh-palaparthi/QuantumDx-Hybrid-QML](https://github.com/mahesh-palaparthi/QuantumDx-Hybrid-QML)

---

## 🌟 Key Platform Innovations

### 1. ⚛️ 4-Qubit QSVM ZZ Feature Map Circuit Explorer
- Interactive visualizer for the authentic **Havlíček et al. (Nature 2019)** ZZ Feature Map state-preparation ansatz:
  $$U_{\Phi(\mathbf{x})} = \big[U_{\Phi(\mathbf{x})} H^{\otimes 4}\big]^2$$
- Maps real patient clinical features into exact rotation angles in real-time:
  - **Single-qubit phase rotations:** $\phi_i = 2 \cdot x_i$ radians on $R_z$ gates
  - **Two-qubit $ZZ$ entangling interactions:** $\phi_{ij} = 2 \cdot (\pi - x_i)(\pi - x_j)$ radians on $R_{zz}$ gates
- Interactive gate inspector displaying Bloch sphere rotations, radians, degrees, and clinical feature sources.

### 2. 🩺 4 Comprehensive Clinical Diagnostic Pathways
1. **Early Stage Diabetes:** 251 real patient records (*Sylhet Diabetes Hospital*), evaluated via Tuned SVM (RBF) and 4-Qubit Quantum Neural Network (QNN).
2. **Pediatric Malnutrition:** Anthropometric diagnostic screening based on WHO/UNICEF growth standards (Severe Acute Malnutrition vs Healthy Growth).
3. **Cardiovascular / Heart Disease:** 270 clinical hemodynamic patient records (*Statlog Cleveland Clinic*), evaluated via Logistic Regression and 4-Qubit Variational Quantum Classifier (VQC).
4. **Wisconsin Breast Cancer (WDBC):** 569 fine-needle aspirate biopsy cases (*UCI ML Repository*) with all 30 standard clinical cytopathology features evaluated via Deep MLP and QSVM Hilbert Kernel.

### 3. 🛡️ Tri-State Clinical Consensus Verdict & Quantum Safety Gate
- Moves beyond a single probabilistic risk meter to an actionable **Tri-State Verdict**:
  - **Positive (Dual Confirmed):** Both Classical ML and Quantum VQC agree on elevated risk.
  - **Negative (Dual Confirmed):** Both systems verify normal baseline parameters.
  - **Inconclusive (Safety Gate Active):** When Classical and Quantum systems diverge ($\Delta \ge 45\%$), the safety gate trips automatically to recommend confirmatory clinical lab testing, preventing false negatives.

### 4. 🧬 Explainable AI (XAI) & Diagnostic Transparency
- Real-time feature attribution with connected XAI importance ranking.
- Compares risk factors vs protective factors to explain *why* the models arrived at their conclusion.
- Interactive decision matrix, quantum circuit simulation, and instant 1-click clinical PDF report generation.

### 5. 🔐 Zero-Cloud Dependency PBKDF2 Clinical Authentication
- Standalone authentication with role-based clinical accounts.
- Cryptographic PBKDF2 password hashing (SHA-512, 1000 iterations, random salt) with persistent database session management.

---

## 🏛️ System Architecture

```
[React 18 Frontend (Vite)]
      │
      ├── 1. Verified Clinical Cohort Picker: Authentic dataset cases
      │
      ├── 2. Node.js Gateway Server: Authentication, Session DB & Microservice Proxy
      │      │
      │      └── 3. Python FastAPI Engine:
      │             ├── Classical ML: Tuned SVM, Deep MLP, Logistic Regression
      │             └── PennyLane / Qiskit Quantum Simulator:
      │                 ├── QSVM (ZZ Feature Map Kernel)
      │                 └── 4-Qubit Variational Quantum Classifier (QVQC) / QNN
      │
      ├── 4. Dual Consensus Matrix & Quantum Disagreement Safety Gating
      │
      ├── 5. Tri-State Clinical Consensus Verdict (Positive / Negative / Inconclusive)
      │
      └── 6. Interactive 4-Qubit QSVM Circuit Explorer & Dynamic XAI Visualizer
```

---

## 🔬 Benchmark Performance & Validation

| Condition / Dataset | Classical Model | Classical Acc | Classical Sens | Quantum Model | Quantum Acc | Quantum ROC-AUC |
|---|---|---|---|---|---|---|
| **Early Stage Diabetes** (*Sylhet*) | Tuned SVM (RBF) | **94.00%** | **98.57%** | QNN (4 Qubits) | **81.30%** | **91.43%** |
| **Pediatric Malnutrition** (*WHO/UNICEF*) | Random Forest | **92.50%** | **95.20%** | Q-Classifier (4 Qubits) | **83.10%** | **89.70%** |
| **Heart Disease** (*Statlog Cleveland*) | Logistic Regression | **88.24%** | **89.50%** | QVQC (4 Qubits) | **82.35%** | **88.60%** |
| **Breast Cancer** (*UCI Diagnostic*) | Deep MLP | **98.24%** | **98.50%** | QSVM (4 Qubits) | **94.74%** | **97.40%** |

---

## 🚀 Local Development Setup

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
pip install -r requirements.txt
python -m uvicorn python_api:app --host 127.0.0.1 --port 8000
```

### 3. Set Up Node.js Gateway Server
```bash
cd backend
npm install
node server.js
```

### 4. Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5174/` or `http://localhost:5173/`.

---

## 📜 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
