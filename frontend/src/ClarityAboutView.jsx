import React from "react";

export default function ClarityAboutView({ onGoToScreening }) {
  return (
    <div className="clarity-content">
      {/* Top Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / About Us</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <h2 className="clarity-page-title">Health information. Human understanding.</h2>
          <p className="clarity-page-subtitle">
            QuantumDx is an advanced hybrid classical-quantum machine learning platform engineered for multi-disease early screening and clinical decision support.
          </p>
        </div>
        {onGoToScreening && (
          <button
            type="button"
            className="clarity-btn-primary"
            onClick={onGoToScreening}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            <span>Start Screening</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Hero Card */}
      <div className="clarity-hero-card">
        <div className="clarity-hero-text">
          <div className="clarity-hero-tag">ABOUT QUANTUMDX · PROJECT ARCHITECTURE</div>
          <h3 className="clarity-hero-title">Bridging Hilbert Space and Clinical Practice.</h3>
          <p className="clarity-hero-desc">
            Early disease detection often suffers from subtle, high-dimensional non-linear interactions between clinical biomarkers that classical algorithms alone can miss or overfit. QuantumDx combines established Classical ML baselines with Parameterized Quantum Circuits (QNN, QSVM, VQC) running on Qiskit Aer simulators to create an explainable, dual-perspective diagnostic safety net.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: 14 }}>
            <span className="clarity-tag-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF", fontWeight: 700 }}>
              ⚛️ 4-Qubit Quantum Kernel
            </span>
            <span className="clarity-tag-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF", fontWeight: 700 }}>
              🛡️ Dual Consensus Safety Gate
            </span>
            <span className="clarity-tag-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF", fontWeight: 700 }}>
              🔬 4 Disease Modalities
            </span>
          </div>
        </div>

        {/* Orbital Graphic */}
        <div className="clarity-orbital-graphic">
          <div className="clarity-orbital-circle clarity-orbital-c2" />
          <div className="clarity-orbital-circle clarity-orbital-c1" />
          <div className="clarity-chip-classical">
            <span>⚙️</span>
            <span>Classical ML</span>
          </div>
          <div className="clarity-pulse-center">
            <span>♥</span>
          </div>
          <div className="clarity-chip-quantum">
            <span>⚛️</span>
            <span>Quantum ML</span>
          </div>
        </div>
      </div>

      {/* Section 1: One Screening. Two Perspectives. */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px", color: "var(--c-text-primary)" }}>
          One screening. Two perspectives.
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--c-text-muted)", margin: 0 }}>
          &quot;Hybrid&quot; in QuantumDx means a side-by-side consensus evaluation between Classical ML and Quantum ML — not an opaque black-box merger.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            📋
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            01 Share the context
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Choose one of four clinical disease pathways, then enter symptoms and validated laboratory measurements. Pediatric malnutrition leverages caregiver-led WHO growth standards.
          </p>
        </div>

        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            ⚙️
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            02 Dual-Engine Inference
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Classical ML maps boundaries via Support Vector Machines, Random Forests, and Multi-Layer Perceptrons. Simultaneously, Quantum ML embeds features into a 2⁴ = 16-dimensional Hilbert space using parameterized ansatz circuits.
          </p>
        </div>

        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            🛡️
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            03 Consensus Safety Gate
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.55, margin: 0 }}>
            Whenever Classical and Quantum models diverge significantly (&Delta; &ge; 45%) or fall into the clinical deadband (0.42–0.58), the system halts binary output and triggers an Inconclusive / Human Review flag.
          </p>
        </div>
      </div>

      {/* Section 2: Four Disease Clinical Pathways & Benchmarks */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px", color: "var(--c-text-primary)" }}>
          The Four Clinical Diagnostic Pathways
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--c-text-muted)", margin: 0 }}>
          Rigorous clinical datasets trained and benchmarked against verified cohort cases.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 28 }}>
        {/* Pathway 1: Diabetes */}
        <div className="clarity-num-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "24px" }}>💧</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "var(--c-text-primary)" }}>
                Early Stage Diabetes Mellitus
              </h4>
              <span style={{ fontSize: "12px", color: "var(--c-text-muted)" }}>Sylhet Diabetes Hospital Dataset · 16 Biomarkers</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
            Screening captures osmotic polyuria, polydipsia, sudden weight loss, alopecia, and genital thrush. Evaluates early glycemic dysregulation before irreversible microvascular damage occurs.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Classical Tuned SVM (RBF):</span>
              <strong style={{ color: "var(--c-teal)" }}>94.00% Acc · 98.57% Sensitivity</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--c-text-muted)" }}>Hybrid Quantum QNN (4 Qubits):</span>
              <strong style={{ color: "var(--c-navy)" }}>81.30% Acc · 91.43% ROC-AUC</strong>
            </div>
          </div>
        </div>

        {/* Pathway 2: Heart Disease */}
        <div className="clarity-num-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "24px" }}>❤️</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "var(--c-text-primary)" }}>
                Cardiovascular / Heart Disease
              </h4>
              <span style={{ fontSize: "12px", color: "var(--c-text-muted)" }}>Statlog & Cleveland Heart Cohorts · 13 Hemodynamic Features</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
            Analyzes resting blood pressure, serum cholesterol, exercise ST-depression (oldpeak), chest discomfort typology, resting ECG, and fluoroscopy vessel counts.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Classical Logistic / SVM:</span>
              <strong style={{ color: "var(--c-teal)" }}>88.20% Acc · 90.00% Recall</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--c-text-muted)" }}>Variational Quantum Classifier (VQC):</span>
              <strong style={{ color: "var(--c-navy)" }}>82.40% Acc · 84.60% Precision</strong>
            </div>
          </div>
        </div>

        {/* Pathway 3: Breast Cancer */}
        <div className="clarity-num-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "24px" }}>🎗️</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "var(--c-text-primary)" }}>
                Breast Cancer (Diagnostic)
              </h4>
              <span style={{ fontSize: "12px", color: "var(--c-text-muted)" }}>Wisconsin WDBC Dataset · 30 Morphometric Dimensions</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
            Evaluates fine-needle aspirate (FNA) digital cytology: mean, standard error, and worst cell nuclei radius, texture, perimeter, area, smoothness, and concavity.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Classical Deep Neural Classifier (MLP):</span>
              <strong style={{ color: "var(--c-teal)" }}>98.24% Acc · 98.50% Sensitivity</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--c-text-muted)" }}>Quantum Kernel QSVM:</span>
              <strong style={{ color: "var(--c-navy)" }}>94.70% Acc · 95.10% Recall</strong>
            </div>
          </div>
        </div>

        {/* Pathway 4: Malnutrition */}
        <div className="clarity-num-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: "24px" }}>👶</span>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: 800, margin: 0, color: "var(--c-text-primary)" }}>
                Pediatric Malnutrition (SAM / MAM)
              </h4>
              <span style={{ fontSize: "12px", color: "var(--c-text-muted)" }}>WHO / UNICEF Child Growth Standards · Ages 6–59 Months</span>
            </div>
          </div>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 12px" }}>
            Assesses acute wasting and stunting via Mid-Upper Arm Circumference (MUAC &lt; 115mm indicates SAM), Weight-for-Height Z-score, and bilateral nutritional edema.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Classical Calibrated Gradient Boost:</span>
              <strong style={{ color: "var(--c-teal)" }}>92.50% Acc · 94.00% Recall</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--c-text-muted)" }}>Hybrid Quantum QNN:</span>
              <strong style={{ color: "var(--c-navy)" }}>86.80% Acc · 88.00% ROC-AUC</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: The Mathematical Consensus Engine */}
      <div className="clarity-num-card" style={{ marginBottom: 28, background: "linear-gradient(180deg, #FFFFFF, #F8FAFC)" }}>
        <h4 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 10px", color: "var(--c-navy)" }}>
          📐 Mathematical Foundation of the Dual Consensus Engine
        </h4>
        <p style={{ fontSize: "13px", color: "var(--c-text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
          In traditional clinical machine learning, a single probability score is thresholded at 0.5. QuantumDx rejects this brittle paradigm by introducing an evidence-weighted agreement metric coupled with multi-condition divergence gating:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--c-teal)", letterSpacing: "0.5px" }}>HYBRID CONSENSUS SCORE</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-navy)", margin: "6px 0 4px", fontFamily: "monospace" }}>
              H = w_c·P_c + w_q·P_q
            </div>
            <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: 0, lineHeight: 1.4 }}>
              Calibrated weights (w_c &asymp; 0.515, w_q &asymp; 0.485) balance classical statistical empirical power with quantum state representation.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#d97706", letterSpacing: "0.5px" }}>DIVERGENCE METRIC</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-navy)", margin: "6px 0 4px", fontFamily: "monospace" }}>
              &Delta; = |P_classical - P_quantum|
            </div>
            <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: 0, lineHeight: 1.4 }}>
              When &Delta; &ge; 45% and models propose opposing diagnoses, the system detects irreconcilable feature space discordance and triggers a safety hold.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", padding: "14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#dc2626", letterSpacing: "0.5px" }}>CLINICAL DEADBAND</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-navy)", margin: "6px 0 4px", fontFamily: "monospace" }}>
              0.42 &le; H &le; 0.58
            </div>
            <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: 0, lineHeight: 1.4 }}>
              Borderline probability regions with model disagreement are protected against coin-flip classification. Immediate clinical secondary testing is advised.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Technology Stack & Security */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="clarity-num-card">
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 14px", color: "var(--c-text-primary)" }}>
            ⚡ Quantum & Classical Computational Stack
          </h4>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: "13px", color: "var(--c-text-secondary)", lineHeight: 1.8 }}>
            <li><strong>Quantum Simulators:</strong> Qiskit Aer Statevector &amp; PennyLane autograd backend.</li>
            <li><strong>Quantum Circuits:</strong> 4-Qubit parameterised variational ansatz with angle-encoding and ZZFeatureMap.</li>
            <li><strong>Classical Engine:</strong> Scikit-Learn SVM, Calibrated LightGBM, and PyTorch Deep MLP.</li>
            <li><strong>API Layer:</strong> FastAPI async non-blocking prediction endpoints with LRU feature caching.</li>
            <li><strong>Explainability (XAI):</strong> Permutation feature importance and protective factor attributions.</li>
          </ul>
        </div>

        <div className="clarity-num-card">
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 14px", color: "var(--c-text-primary)" }}>
            🛡️ Privacy & Clinical Boundaries
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.55, margin: "0 0 14px" }}>
            QuantumDx processes feature vectors entirely in-memory for inference. Screening history is persisted strictly to your local authenticated session database.
          </p>
          <div style={{ background: "var(--c-amber-bg)", border: "1px solid var(--c-amber-border)", borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>🩺</span>
            <div>
              <strong style={{ fontSize: "12.5px", color: "var(--c-amber-text)", display: "block" }}>Decision Support · Not Autonomous Diagnosis</strong>
              <span style={{ fontSize: "12px", color: "#78350F", lineHeight: 1.4, display: "block", marginTop: 2 }}>
                Machine learning scores provide early investigative context. They cannot replace physical clinical examinations, biopsy pathology, or physician judgment.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
