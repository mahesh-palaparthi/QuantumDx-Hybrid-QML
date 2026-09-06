import React, { useMemo } from "react";

/**
 * RiskStratificationMeter
 * Semicircular radial arc gauge visualizing predicted disease risk level (0-100%).
 * Color-coded for clinical triage:
 *   - 0% to 40%: Low Risk (Emerald Green #10b981)
 *   - 40% to 65%: Moderate Risk / Uncertainty Deadband (Amber #f59e0b)
 *   - 65% to 100%: High Risk (Crimson Red #ef4444)
 *   - Divergent: Clinical Review (Purple #a855f7)
 */
export default function RiskStratificationMeter({
  riskScore = 0, // 0 to 100
  isDisagreement = false,
  finalOutcome = "Negative",
  classicalProb = 0,
  quantumProb = 0,
  diseaseName = "Diabetes Mellitus",
  groundTruth = null,
}) {
  const score = Math.max(0, Math.min(100, Number(riskScore) || 0));

  // Determine triage tier and color palette
  const triage = useMemo(() => {
    if (isDisagreement) {
      return {
        label: "INCONCLUSIVE — CLINICAL REVIEW",
        sublabel: "Hyperplane & Hilbert space divergence (Δ ≥ 0.45)",
        color: "#a855f7",
        bgBadge: "rgba(168, 85, 247, 0.18)",
        borderColor: "rgba(168, 85, 247, 0.4)",
        gradient: "from-purple-400 to-indigo-300",
      };
    }
    if (score >= 65 || finalOutcome === "Positive") {
      return {
        label: "HIGH CLINICAL RISK — PRIORITY 1",
        sublabel: "Dual-model confirmed biomarker elevation",
        color: "#ef4444",
        bgBadge: "rgba(239, 68, 68, 0.18)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        gradient: "from-red-400 to-amber-300",
      };
    }
    if (score >= 40) {
      return {
        label: "MODERATE RISK — MONITORING",
        sublabel: "Borderline presentation; secondary panel advised",
        color: "#f59e0b",
        bgBadge: "rgba(245, 158, 11, 0.18)",
        borderColor: "rgba(245, 158, 11, 0.4)",
        gradient: "from-amber-400 to-yellow-300",
      };
    }
    return {
      label: "LOW RISK — HEALTHY BASELINE",
      sublabel: "Concordant negative biomarkers; normal range",
      color: "#10b981",
      bgBadge: "rgba(16, 185, 129, 0.18)",
      borderColor: "rgba(16, 185, 129, 0.4)",
      gradient: "from-emerald-400 to-teal-300",
    };
  }, [score, isDisagreement, finalOutcome]);

  // Needle angle: -90 deg (0%) to +90 deg (100%)
  const needleAngle = -90 + (score / 100) * 180;

  return (
    <div className="qdx-risk-meter-container">
      <div className="qdx-meter-header">
        <div className="qdx-meter-title-wrap">
          <span className="qdx-meter-badge-icon">🛡️</span>
          <div>
            <h3 className="qdx-meter-title">Risk-Stratification Meter</h3>
            <span className="qdx-meter-subtitle">Real-time Clinical Triage & Confidence Quantification</span>
          </div>
        </div>
        <div
          className="qdx-triage-tag"
          style={{
            background: triage.bgBadge,
            borderColor: triage.borderColor,
            color: triage.color,
          }}
        >
          {triage.label}
        </div>
      </div>

      {/* SVG Semicircular Arc Gauge */}
      <div className="qdx-gauge-wrapper">
        <svg className="qdx-gauge-svg" viewBox="0 0 240 135">
          <defs>
            <linearGradient id="lowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="modGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="highGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={triage.color} floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Zone 1: Low Risk (0 - 40%) */}
          <path
            d="M 30 120 A 90 90 0 0 1 85 49"
            fill="none"
            stroke="url(#lowGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Zone 2: Moderate Risk (40 - 65%) */}
          <path
            d="M 85 49 A 90 90 0 0 1 155 49"
            fill="none"
            stroke="url(#modGrad)"
            strokeWidth="16"
            opacity="0.85"
          />

          {/* Zone 3: High Risk (65 - 100%) */}
          <path
            d="M 155 49 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="url(#highGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Tick marks */}
          <line x1="30" y1="120" x2="42" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="120" y1="30" x2="120" y2="42" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="210" y1="120" x2="198" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Labels on Gauge */}
          <text x="32" y="132" fill="#10b981" fontSize="9" fontWeight="700" textAnchor="middle">0%</text>
          <text x="120" y="24" fill="#f59e0b" fontSize="9" fontWeight="700" textAnchor="middle">50%</text>
          <text x="208" y="132" fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">100%</text>

          {/* Animated Needle */}
          <g
            transform={`rotate(${needleAngle} 120 120)`}
            style={{ transition: "transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            filter="url(#gaugeGlow)"
          >
            {/* Needle line */}
            <line x1="120" y1="120" x2="120" y2="38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <polygon points="120,32 116,42 124,42" fill="#ffffff" />
            {/* Center Pivot Point */}
            <circle cx="120" cy="120" r="8" fill="#0f1f3d" stroke={triage.color} strokeWidth="2.5" />
            <circle cx="120" cy="120" r="3.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Big Score Display */}
        <div className="qdx-gauge-score-box">
          <span className="qdx-gauge-numeric" style={{ color: triage.color }}>
            {score.toFixed(1)}%
          </span>
          <span className="qdx-gauge-triage-sub">{triage.sublabel}</span>
        </div>
      </div>

      {/* Dual Engine Confidence Breakdown Cards */}
      <div className="qdx-gauge-dual-row">
        <div className="qdx-gauge-stat-box">
          <div className="qdx-gauge-stat-label">
            <span>📊</span> Classical Model Output
          </div>
          <div className="qdx-gauge-stat-val" style={{ color: "#60a5fa" }}>
            {(Number(classicalProb) * 100).toFixed(1)}%
          </div>
          <div className="qdx-gauge-stat-meter">
            <div
              className="qdx-gauge-bar-fill"
              style={{
                width: `${Math.min(100, Math.round(Number(classicalProb) * 100))}%`,
                background: "#3b82f6",
              }}
            />
          </div>
        </div>

        <div className="qdx-gauge-stat-box">
          <div className="qdx-gauge-stat-label">
            <span>⚛️</span> Quantum State Probability
          </div>
          <div className="qdx-gauge-stat-val" style={{ color: "#c084fc" }}>
            {(Number(quantumProb) * 100).toFixed(1)}%
          </div>
          <div className="qdx-gauge-stat-meter">
            <div
              className="qdx-gauge-bar-fill"
              style={{
                width: `${Math.min(100, Math.round(Number(quantumProb) * 100))}%`,
                background: "#8b5cf6",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
