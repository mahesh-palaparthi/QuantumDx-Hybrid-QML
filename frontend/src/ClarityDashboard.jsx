import React from "react";

export default function ClarityDashboard({
  onSelectScreening,
  screeningHistory = [],
  user,
}) {
  const userName = user?.name?.split(" ")[0] || "Alex";

  const pathways = [
    {
      key: "diabetes",
      title: "Diabetes",
      icon: "💧",
      desc: "Understand how glucose, body measurements and family history may contribute.",
      meta: "About 3 minutes · Adults",
    },
    {
      key: "child_malnutrition",
      title: "Pediatric Malnutrition",
      icon: "👶",
      desc: "Support a child's growth with age-appropriate nutrition and measurement inputs.",
      meta: "About 5 minutes · Ages 6–59 months",
    },
    {
      key: "heart_disease",
      title: "Heart Disease",
      icon: "❤️",
      desc: "Explore heart health using symptoms, blood pressure and cholesterol.",
      meta: "About 4 minutes · Adults",
    },
    {
      key: "breast_cancer",
      title: "Breast Cancer",
      icon: "🎗️",
      desc: "Review breast changes and relevant history to support an informed next step.",
      meta: "About 4 minutes · Adults",
    },
  ];

  const latestScreening = screeningHistory.length > 0 ? screeningHistory[0] : null;

  return (
    <div className="clarity-content">
      {/* Top Title */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">QUANTUMDX CLINICAL WORKSPACE</span>
      </div>
      <h2 className="clarity-page-title">Welcome to QuantumDx Health Screening.</h2>
      <p className="clarity-page-subtitle">
        Hello, {userName}. High-precision hybrid classical-quantum medical decision support.
      </p>

      {/* Hero Navy Card */}
      <div className="clarity-hero-card">
        <div className="clarity-hero-text">
          <div className="clarity-hero-tag">TWO MODELS. ONE CLEARER CONVERSATION.</div>
          <h3 className="clarity-hero-title">Understand more. Take your next step.</h3>
          <p className="clarity-hero-desc">
            Compare Classical ML and Quantum ML, then explore the factors behind each result in a calm, explainable workspace.
          </p>
          <button
            type="button"
            className="clarity-hero-btn"
            onClick={() => onSelectScreening("")}
          >
            <span>Choose a screening</span>
            <span>→</span>
          </button>
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

      {/* Stats Row */}
      <div className="clarity-stats-row">
        <div className="clarity-stat-box">
          <div className="clarity-stat-num">4</div>
          <div className="clarity-stat-label">Screenings available</div>
        </div>
        <div className="clarity-stat-box">
          <div className="clarity-stat-num">4</div>
          <div className="clarity-stat-label">Sample cohorts evaluated</div>
        </div>
        <div className="clarity-stat-box">
          <div className="clarity-stat-num">2</div>
          <div className="clarity-stat-label">Dual model approaches (Classical + Quantum)</div>
        </div>
      </div>

      {/* Where would you like to start? */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--c-text-primary)" }}>
          Where would you like to start?
        </h3>
        <span className="clarity-tag-pill">4 screening pathways</span>
      </div>

      <div className="clarity-pathways-grid">
        {pathways.map((p) => (
          <div key={p.key} className="clarity-pathway-card">
            <div>
              <div className="clarity-pathway-header">
                <div className="clarity-pathway-icon">{p.icon}</div>
                <h4 className="clarity-pathway-title">{p.title}</h4>
              </div>
              <p className="clarity-pathway-desc">{p.desc}</p>
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

      {/* Latest Screening Card */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 4px", color: "var(--c-text-primary)" }}>
          Your latest screening
        </h3>
        <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: "0 0 14px" }}>
          Illustrative sample · Not a real clinical result
        </p>

        <div className="clarity-num-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="clarity-pathway-icon">
              {latestScreening?.diseaseType?.includes("Cancer") ? "🎗️" : latestScreening?.diseaseType?.includes("Malnutrition") ? "👶" : latestScreening?.diseaseType?.includes("Diabetes") ? "💧" : "❤️"}
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-text-primary)" }}>
                {latestScreening?.diseaseType || "Heart Disease"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginTop: 2 }}>
                {latestScreening?.timestamp && !isNaN(new Date(latestScreening.timestamp).getTime())
                  ? new Date(latestScreening.timestamp).toLocaleDateString()
                  : "21 Oct 2026 · 14:32"} · {userName} (demo)
              </div>
              <span className="clarity-badge-pill positive" style={{ marginTop: 6 }}>
                {latestScreening?.consensusVerdict || "Follow-up suggested"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--c-text-primary)" }}>
              Classical ML {Number.isFinite(Number(latestScreening?.classicalProbability)) ? `${Math.round(Number(latestScreening.classicalProbability) * 100)}%` : "72%"} · QML {Number.isFinite(Number(latestScreening?.quantumProbability)) ? `${Math.round(Number(latestScreening.quantumProbability) * 100)}%` : "68%"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--c-text-muted)", marginTop: 2 }}>
              Dual model scores, not diagnosis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
