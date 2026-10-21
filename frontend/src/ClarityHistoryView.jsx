import React from "react";

export default function ClarityHistoryView({
  screeningHistory = [],
  fetchScreeningHistory,
  handleClearHistory,
  onOpenScreening,
}) {
  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(screeningHistory, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "clarity_health_screenings.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="clarity-content">
      {/* Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / Screening History</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 className="clarity-page-title">Screening audit history.</h2>
          <p className="clarity-page-subtitle">
            Securely recorded screenings with full consensus verdicts, confidence and model outputs.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {fetchScreeningHistory && (
            <button
              type="button"
              className="clarity-btn-outline"
              onClick={fetchScreeningHistory}
              title="Refresh records from database"
            >
              🔄 Refresh
            </button>
          )}
          {handleClearHistory && (
            <button
              type="button"
              className="clarity-btn-outline"
              onClick={handleClearHistory}
              disabled={screeningHistory.length === 0}
              style={{
                color: screeningHistory.length > 0 ? "#dc2626" : "var(--c-text-muted)",
                opacity: screeningHistory.length === 0 ? 0.5 : 1,
              }}
            >
              🗑️ Clear
            </button>
          )}
          <button
            type="button"
            className="clarity-btn-primary"
            onClick={handleExportJson}
            disabled={screeningHistory.length === 0}
          >
            📥 Export JSON
          </button>
        </div>
      </div>

      {screeningHistory.length === 0 ? (
        <div className="clarity-num-card" style={{ textAlign: "center", padding: "60px 24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: 12 }}>📋</span>
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px" }}>No screening records yet</h3>
          <p style={{ fontSize: "14px", color: "var(--c-text-secondary)", maxWidth: 440, margin: "0 auto 20px" }}>
            Complete a screening pathway to generate dual-model consensus records with full audit trail.
          </p>
          {onOpenScreening && (
            <button
              type="button"
              className="clarity-btn-primary"
              onClick={onOpenScreening}
            >
              Start New Screening →
            </button>
          )}
        </div>
      ) : (
        <div className="clarity-table-card">
          <table className="clarity-table">
            <thead>
              <tr>
                <th>Date / Time</th>
                <th>Patient ID</th>
                <th>Condition</th>
                <th>Classical ML</th>
                <th>Quantum ML</th>
                <th>Consensus Verdict</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {screeningHistory.map((item, idx) => {
                const dateStr = item.timestamp
                  ? new Date(item.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Just now";

                const isPos = item.consensusVerdict === "Positive";
                const isInconclusive = item.consensusVerdict === "Inconclusive";

                return (
                  <tr key={item._id || item.patientId || idx}>
                    <td style={{ color: "var(--c-text-muted)", fontSize: "13px" }}>{dateStr}</td>
                    <td style={{ fontWeight: 600, color: "var(--c-navy)" }}>{item.patientId}</td>
                    <td>{item.disease}</td>
                    <td>
                      <span className="clarity-tag-pill" style={{ background: "#EEF2F6", color: "var(--c-text-primary)" }}>
                        {item.classicalPrediction} ({item.classicalProbability ? (item.classicalProbability * 100).toFixed(0) + "%" : "--"})
                      </span>
                    </td>
                    <td>
                      <span className="clarity-tag-pill" style={{ background: "var(--c-mint)", color: "var(--c-teal)", fontWeight: 700 }}>
                        {item.quantumPrediction} ({item.quantumProbability ? (item.quantumProbability * 100).toFixed(0) + "%" : "--"})
                      </span>
                    </td>
                    <td>
                      <span
                        className="clarity-tag-pill"
                        style={{
                          background: isInconclusive ? "#FEF3C7" : isPos ? "#FEE2E2" : "#DCFCE7",
                          color: isInconclusive ? "#B45309" : isPos ? "#B91C1C" : "#15803D",
                          fontWeight: 700,
                        }}
                      >
                        {isInconclusive ? "⚠️ Inconclusive" : isPos ? "⚠️ Risk Flagged" : "✓ Clear Baseline"}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--c-text-primary)" }}>
                      {item.confidencePercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
