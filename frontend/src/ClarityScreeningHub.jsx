import React from "react";

export default function ClarityScreeningHub({
  onSelectScreening,
  onGoToBenchmarks,
}) {
  const pathways = [
    {
      key: "diabetes",
      title: "Diabetes",
      icon: "💧",
      desc: "Understand how glucose, body measurements and family history may contribute.",
      readyLabel: "Fasting glucose, height, weight and blood pressure",
      meta: "About 3 minutes · Adults",
    },
    {
      key: "child_malnutrition",
      title: "Pediatric Malnutrition",
      icon: "👶",
      desc: "Support a child's growth with age-appropriate nutrition and measurement inputs.",
      readyLabel: "Child's age in months, weight, height and arm circumference",
      meta: "About 5 minutes · Ages 6–59 months",
    },
    {
      key: "heart_disease",
      title: "Heart Disease",
      icon: "❤️",
      desc: "Explore heart health using symptoms, blood pressure and cholesterol.",
      readyLabel: "Blood pressure, cholesterol and recent test results",
      meta: "About 4 minutes · Adults",
    },
    {
      key: "breast_cancer",
      title: "Breast Cancer",
      icon: "🎗️",
      desc: "Review breast changes and relevant history to support an informed next step.",
      readyLabel: "Breast symptoms, personal and family history",
      meta: "About 4 minutes · Adults",
    },
  ];

  return (
    <div className="clarity-content">
      {/* Top Header Row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="clarity-breadcrumb">
            <span className="clarity-breadcrumb-text">Home / Disease Prediction</span>
          </div>
          <h2 className="clarity-page-title">Choose your screening.</h2>
          <p className="clarity-page-subtitle">
            Select a health area to begin. You'll see the same information compared across two model approaches.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToBenchmarks}
          style={{
            background: "#FFFFFF",
            border: "1px solid var(--c-card-border)",
            borderRadius: "8px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--c-teal)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "var(--c-shadow-sm)",
          }}
        >
          <span>Model benchmarks</span>
          <span>📈</span>
        </button>
      </div>

      {/* 3-Step Process Track */}
      <div className="clarity-steps-track">
        <div className="clarity-step-item active">
          <div className="clarity-step-dot">01</div>
          <div>
            <div style={{ color: "var(--c-text-primary)" }}>Choose a health area</div>
            <div style={{ fontSize: "11px", color: "var(--c-text-muted)" }}>Pick the screening relevant to you.</div>
          </div>
        </div>

        <div style={{ color: "#CBD5E1", fontSize: "16px" }}>→</div>

        <div className="clarity-step-item">
          <div className="clarity-step-dot">02</div>
          <div>
            <div>Share health information</div>
            <div style={{ fontSize: "11px", color: "var(--c-text-muted)" }}>Add symptoms and measurements.</div>
          </div>
        </div>

        <div style={{ color: "#CBD5E1", fontSize: "16px" }}>→</div>

        <div className="clarity-step-item">
          <div className="clarity-step-dot">03</div>
          <div>
            <div>Understand your results</div>
            <div style={{ fontSize: "11px", color: "var(--c-text-muted)" }}>Compare models and explore the why.</div>
          </div>
        </div>
      </div>

      {/* 4-Pathway 2x2 Grid */}
      <div className="clarity-pathways-grid">
        {pathways.map((p) => (
          <div key={p.key} className="clarity-pathway-card">
            <div>
              <div className="clarity-pathway-header">
                <div className="clarity-pathway-icon">{p.icon}</div>
                <h4 className="clarity-pathway-title">{p.title}</h4>
              </div>
              <p className="clarity-pathway-desc">{p.desc}</p>
              
              <div className="clarity-pathway-info-block">
                <div className="clarity-pathway-info-label">What to have ready</div>
                <div className="clarity-pathway-info-val">{p.readyLabel}</div>
              </div>

              <div className="clarity-pathway-meta">{p.meta}</div>
            </div>

            <button
              type="button"
              className="clarity-pathway-btn"
              onClick={() => onSelectScreening(p.key)}
            >
              <span>Start Screening</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Information Alerts */}
      <div className="clarity-alert clarity-alert-blue">
        <span style={{ fontSize: "16px" }}>☑</span>
        <div>
          <strong style={{ display: "block", marginBottom: 2 }}>Before you begin</strong>
          Use recent measurements where possible. Required fields are marked with *. If you don't know a measurement, ask a healthcare professional rather than guessing. All values shown in this workspace are illustrative.
        </div>
      </div>

      <div className="clarity-alert clarity-alert-amber">
        <span style={{ fontSize: "16px" }}>⚠️</span>
        <div>
          <strong style={{ display: "block", marginBottom: 2 }}>When not to use a screening</strong>
          If you have severe chest pain, difficulty breathing or another urgent symptom, seek emergency medical care now. Do not wait for a screening result.
        </div>
      </div>

      <div style={{ textAlign: "center", fontSize: "11.5px", color: "#94A3B8", marginTop: 20 }}>
        Screening support, not a diagnosis. Seek medical advice from a qualified clinician.<br />
        Illustrative demo only. Patient values, predictions and model statistics are not real clinical results.
      </div>
    </div>
  );
}
