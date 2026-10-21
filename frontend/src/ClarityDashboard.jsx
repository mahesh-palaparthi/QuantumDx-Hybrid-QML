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

  const latestScreening = Array.isArray(screeningHistory) && screeningHistory.length > 0
    ? screeningHistory[0]
    : null;

  // Resolve disease details accurately from any field format
  const rawDisease = String(
    latestScreening?.diseaseName ||
    latestScreening?.diseaseType ||
    latestScreening?.disease ||
    latestScreening?.diseaseKey ||
    "Heart Disease"
  );

  const isCancer = rawDisease.toLowerCase().includes("cancer");
  const isMalnutrition = rawDisease.toLowerCase().includes("malnutrition") || rawDisease.toLowerCase().includes("pediatric");
  const isDiabetes = rawDisease.toLowerCase().includes("diabetes");

  const diseaseDisplayName = isCancer
    ? "Breast Cancer"
    : isMalnutrition
    ? "Pediatric Malnutrition"
    : isDiabetes
    ? "Early Stage Diabetes"
    : "Heart Disease";

  const pathwayKey = isCancer
    ? "breast_cancer"
    : isMalnutrition
    ? "child_malnutrition"
    : isDiabetes
    ? "diabetes"
    : "heart_disease";

  const diseaseIcon = isCancer ? "🎗️" : isMalnutrition ? "👶" : isDiabetes ? "💧" : "❤️";

  // Consensus verdict & badge styling
  const rawVerdict = String(latestScreening?.consensusVerdict || "Negative").trim();
  const isPos = rawVerdict.toLowerCase().includes("pos") || rawVerdict.toLowerCase().includes("follow");
  const isInconc = rawVerdict.toLowerCase().includes("inconc") || rawVerdict.toLowerCase().includes("safety");

  const badgeClass = isPos ? "positive" : isInconc ? "inconclusive" : "negative";
  const badgeLabel = isPos
    ? "Follow-up suggested"
    : isInconc
    ? "Inconclusive review"
    : "Lower model score";

  // Probabilities
  const cProbVal = latestScreening?.classicalProbability ?? latestScreening?.classicalProb;
  const qProbVal = latestScreening?.quantumProbability ?? latestScreening?.quantumProb;
  const cProbPct = Number.isFinite(Number(cProbVal)) ? Math.max(3, Math.min(96, Math.round(Number(cProbVal) * 100))) : 72;
  const qProbPct = Number.isFinite(Number(qProbVal)) ? Math.max(3, Math.min(96, Math.round(Number(qProbVal) * 100))) : 68;

  // Timestamp formatting
  const ts = latestScreening?.timestamp ? new Date(latestScreening.timestamp) : new Date();
  const dateFormatted = !isNaN(ts.getTime())
    ? ts.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : "10/21/2026";

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "0 0 14px" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 4px", color: "var(--c-text-primary)" }}>
              Your latest screening
            </h3>
            <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: 0 }}>
              {latestScreening ? "Real-time clinical screening record from active session" : "Illustrative sample · Not a real clinical result"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectScreening(pathwayKey)}
            style={{
              background: "none",
              border: "none",
              color: "var(--c-navy)",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            Open in Studio →
          </button>
        </div>

        <div
          className="clarity-num-card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            cursor: "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={() => onSelectScreening(pathwayKey)}
          title={`Click to open ${diseaseDisplayName} in screening studio`}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="clarity-pathway-icon">
              {diseaseIcon}
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-text-primary)" }}>
                {diseaseDisplayName}
              </div>
              <div style={{ fontSize: "12px", color: "var(--c-text-muted)", marginTop: 2 }}>
                {dateFormatted} · {userName} (demo)
              </div>
              <span className={`clarity-badge-pill ${badgeClass}`} style={{ marginTop: 6 }}>
                {badgeLabel}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--c-text-primary)" }}>
                Classical ML {cProbPct}% · QML {qProbPct}%
              </div>
              <div style={{ fontSize: "11px", color: "var(--c-text-muted)", marginTop: 2 }}>
                Dual model scores, not diagnosis
              </div>
            </div>
            <div style={{ fontSize: "18px", color: "var(--c-navy)", fontWeight: 700 }}>
              →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
