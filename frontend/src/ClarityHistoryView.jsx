import React, { useState, useMemo } from "react";

export default function ClarityHistoryView({
  screeningHistory = [],
  onOpenScreening,
  onViewResultItem,
  onGoToProfile,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("all");
  const [dateFilter, setDateFilter] = useState("oct_2026");
  const [sortBy, setSortBy] = useState("newest");

  // Default sample history from the Figma design (Image 1) so it matches the visual reference perfectly
  const DEFAULT_SAMPLE_HISTORY = [
    {
      id: "sample-1",
      diseaseKey: "heart_disease",
      diseaseName: "Heart Disease",
      icon: "🫀",
      subject: "Alex Morgan · Demo",
      dateFormatted: "21 Oct 2026",
      timeFormatted: "14:32",
      classicalPct: 72,
      quantumPct: 68,
      status: "follow_up",
      statusLabel: "Follow-up suggested",
      classicalPrediction: "Positive",
      classicalProbability: 0.72,
      quantumPrediction: "Positive",
      quantumProbability: 0.68,
      consensusVerdict: "Positive",
      confidencePercent: 70,
    },
    {
      id: "sample-2",
      diseaseKey: "diabetes",
      diseaseName: "Diabetes",
      icon: "💧",
      subject: "Alex Morgan · Demo",
      dateFormatted: "18 Oct 2026",
      timeFormatted: "09:15",
      classicalPct: 24,
      quantumPct: 28,
      status: "lower_score",
      statusLabel: "Lower model score",
      classicalPrediction: "Negative",
      classicalProbability: 0.24,
      quantumPrediction: "Negative",
      quantumProbability: 0.28,
      consensusVerdict: "Negative",
      confidencePercent: 74,
    },
    {
      id: "sample-3",
      diseaseKey: "breast_cancer",
      diseaseName: "Breast Cancer",
      icon: "🎗️",
      subject: "Sample adult · Demo",
      dateFormatted: "12 Oct 2026",
      timeFormatted: "16:08",
      classicalPct: 31,
      quantumPct: 35,
      status: "lower_score",
      statusLabel: "Lower model score",
      classicalPrediction: "Negative",
      classicalProbability: 0.31,
      quantumPrediction: "Negative",
      quantumProbability: 0.35,
      consensusVerdict: "Negative",
      confidencePercent: 67,
    },
    {
      id: "sample-4",
      diseaseKey: "child_malnutrition",
      diseaseName: "Pediatric Malnutrition",
      icon: "👶",
      subject: "Child A · Demo",
      dateFormatted: "08 Oct 2026",
      timeFormatted: "11:40",
      classicalPct: 61,
      quantumPct: 57,
      status: "follow_up",
      statusLabel: "Follow-up suggested",
      classicalPrediction: "Positive",
      classicalProbability: 0.61,
      quantumPrediction: "Positive",
      quantumProbability: 0.57,
      consensusVerdict: "Positive",
      confidencePercent: 59,
    },
  ];

  // Map real database records if available, otherwise prepend them to sample items
  const combinedRecords = useMemo(() => {
    const list = Array.isArray(screeningHistory) ? screeningHistory : [];
    const liveItems = list
      .map((item, idx) => {
        try {
          if (!item) return null;
          const d = item.timestamp ? new Date(item.timestamp) : new Date();
          const isValidDate = !isNaN(d.getTime());
          const dateStr = isValidDate
            ? d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
            : "21 Oct 2026";
          const timeStr = isValidDate
            ? d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
            : "14:32";

          const cProb =
            item.classicalProbability != null && !isNaN(Number(item.classicalProbability))
              ? Number(item.classicalProbability)
              : 0.5;
          const qProb =
            item.quantumProbability != null && !isNaN(Number(item.quantumProbability))
              ? Number(item.quantumProbability)
              : 0.5;

          const isPos = item.consensusVerdict === "Positive";
          const isInconclusive = item.consensusVerdict === "Inconclusive";

          const cPct = Math.max(3, Math.min(96, Math.round(cProb * 100)));
          const qPct = Math.max(3, Math.min(96, Math.round(qProb * 100)));

          const dName = typeof item.disease === "string" ? item.disease : "Heart Disease";
          const isHeart = dName.toLowerCase().includes("heart");
          const isCancer = dName.toLowerCase().includes("cancer");
          const isDiabetes = dName.toLowerCase().includes("diabetes");
          const isMalnutrition = dName.toLowerCase().includes("malnutrition");

          const icon = isHeart ? "🫀" : isCancer ? "🎗️" : isMalnutrition ? "👶" : "💧";
          const diseaseKey = isHeart
            ? "heart_disease"
            : isCancer
            ? "breast_cancer"
            : isMalnutrition
            ? "child_malnutrition"
            : "diabetes";

          return {
            id: item._id || item.patientId || `live-${idx}`,
            diseaseKey,
            diseaseName: isHeart
              ? "Heart Disease"
              : isCancer
              ? "Breast Cancer"
              : isMalnutrition
              ? "Pediatric Malnutrition"
              : "Diabetes",
            icon,
            subject: item.patientName || "Alex Morgan · Patient",
            dateFormatted: dateStr,
            timeFormatted: timeStr,
            classicalPct: cPct,
            quantumPct: qPct,
            status: isInconclusive ? "inconclusive" : isPos ? "follow_up" : "lower_score",
            statusLabel: isInconclusive ? "Inconclusive review" : isPos ? "Follow-up suggested" : "Lower model score",
            classicalPrediction: item.classicalPrediction || "Negative",
            classicalProbability: cProb,
            quantumPrediction: item.quantumPrediction || "Negative",
            quantumProbability: qProb,
            consensusVerdict: item.consensusVerdict || "Negative",
            confidencePercent: item.confidencePercent || 70,
            rawRecord: item,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return [...liveItems, ...DEFAULT_SAMPLE_HISTORY];
  }, [screeningHistory]);

  // Filter and sort
  const filteredRecords = useMemo(() => {
    return combinedRecords.filter((rec) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = rec.diseaseName.toLowerCase().includes(q);
        const matchSub = rec.subject.toLowerCase().includes(q);
        if (!matchName && !matchSub) return false;
      }
      // Disease dropdown
      if (selectedDisease !== "all" && rec.diseaseKey !== selectedDisease) {
        return false;
      }
      return true;
    });
  }, [combinedRecords, searchTerm, selectedDisease]);

  const followUpCount = filteredRecords.filter((r) => r.status === "follow_up" || r.status === "inconclusive").length;
  const latestDateStr = filteredRecords.length > 0 ? filteredRecords[0].dateFormatted : "21 Oct 2026";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDisease("all");
    setDateFilter("oct_2026");
  };

  return (
    <div className="clarity-content">
      {/* Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / Prediction History</span>
      </div>

      {/* Top Header Row with Title and "New screening +" button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h2 className="clarity-page-title">Your screening history.</h2>
          <p className="clarity-page-subtitle">
            Return to previous comparisons and the information behind each result.
          </p>
        </div>
        {onOpenScreening && (
          <button
            type="button"
            className="clarity-btn-primary"
            onClick={onOpenScreening}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 8,
            }}
          >
            <span>New screening</span>
            <span style={{ fontSize: "16px" }}>+</span>
          </button>
        )}
      </div>

      {/* Informative Blue / Mint Advisory Banner (Image 1) */}
      <div
        style={{
          background: "#F0F9FF",
          border: "1px solid #BAE6FD",
          borderRadius: "10px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: "18px", color: "var(--c-teal)", marginTop: 1 }}>🔄</span>
        <div>
          <strong style={{ fontSize: "13.5px", color: "var(--c-navy)", display: "block" }}>
            Sample history
          </strong>
          <span style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, display: "block" }}>
            These records and all scores are illustrative. They are not real patient records. Lower model scores do not rule out disease.
          </span>
        </div>
      </div>

      {/* 3 Metric Cards Row (Image 1) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="clarity-num-card" style={{ padding: "18px 22px" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--c-navy)", lineHeight: 1 }}>
            {filteredRecords.length}
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--c-text-muted)", marginTop: 8 }}>
            Sample screenings
          </div>
        </div>

        <div className="clarity-num-card" style={{ padding: "18px 22px" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--c-navy)", lineHeight: 1 }}>
            {latestDateStr}
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--c-text-muted)", marginTop: 8 }}>
            Most recent screening
          </div>
        </div>

        <div className="clarity-num-card" style={{ padding: "18px 22px" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--c-navy)", lineHeight: 1 }}>
            {followUpCount}
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--c-text-muted)", marginTop: 8 }}>
            Samples suggesting follow-up
          </div>
        </div>
      </div>

      {/* Filter Controls Row (Image 1) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1.2fr 1fr auto",
          gap: 14,
          alignItems: "end",
          marginBottom: 20,
        }}
      >
        <div>
          <label className="clarity-field-label" style={{ marginBottom: 6 }}>Search screenings</label>
          <input
            type="text"
            className="clarity-input"
            placeholder="Enter disease or sample name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <label className="clarity-field-label" style={{ marginBottom: 6 }}>Disease category</label>
          <select
            className="clarity-select"
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
          >
            <option value="all">All diseases</option>
            <option value="heart_disease">Heart Disease</option>
            <option value="diabetes">Diabetes</option>
            <option value="breast_cancer">Breast Cancer</option>
            <option value="child_malnutrition">Pediatric Malnutrition</option>
          </select>
        </div>

        <div>
          <label className="clarity-field-label" style={{ marginBottom: 6 }}>Date range</label>
          <select
            className="clarity-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="oct_2026">October 2026</option>
            <option value="all_time">All time</option>
          </select>
        </div>

        <div>
          <button
            type="button"
            className="clarity-btn-outline"
            onClick={clearFilters}
            style={{ padding: "9px 16px", height: "42px" }}
          >
            <span>✕</span>
            <span>Clear filters</span>
          </button>
        </div>
      </div>

      {/* Subheader: Item count + Sort (Image 1) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--c-text-primary)" }}>
          {filteredRecords.length} sample screenings
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12.5px", color: "var(--c-text-muted)" }}>
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              fontWeight: 600,
              color: "var(--c-text-primary)",
              cursor: "pointer",
              fontSize: "12.5px",
            }}
          >
            <option value="newest">Newest first ↓</option>
            <option value="oldest">Oldest first ↑</option>
          </select>
        </div>
      </div>

      {/* Screening History Table (Image 1) */}
      <div className="clarity-table-card" style={{ marginBottom: 24 }}>
        <table className="clarity-table">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>SCREENING / DEMO SUBJECT</th>
              <th style={{ width: "18%" }}>DATE</th>
              <th style={{ width: "12%" }}>CLASSICAL ML</th>
              <th style={{ width: "12%" }}>QUANTUM ML</th>
              <th style={{ width: "16%" }}>SAMPLE STATUS</th>
              <th style={{ width: "10%", textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((item) => {
              const isFollowUp = item.status === "follow_up";
              const isInconclusive = item.status === "inconclusive";

              return (
                <tr key={item.id}>
                  {/* Screening / Demo Subject */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: "#E6F7F5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--c-text-primary)", fontSize: "13.5px" }}>
                          {item.diseaseName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--c-text-muted)" }}>
                          {item.subject}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div style={{ fontSize: "13px", color: "var(--c-text-primary)", fontWeight: 500 }}>
                      {item.dateFormatted}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--c-text-muted)" }}>
                      {item.timeFormatted}
                    </div>
                  </td>

                  {/* Classical ML */}
                  <td>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0E2942" }}>
                      {item.classicalPct}%
                    </span>
                  </td>

                  {/* Quantum ML */}
                  <td>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0E2942" }}>
                      {item.quantumPct}%
                    </span>
                  </td>

                  {/* Sample Status Badge (Image 1) */}
                  <td>
                    {isInconclusive ? (
                      <span
                        className="clarity-tag-pill"
                        style={{ background: "#FEF3C7", color: "#B45309", fontWeight: 700, fontSize: "11.5px" }}
                      >
                        Inconclusive review
                      </span>
                    ) : isFollowUp ? (
                      <span
                        className="clarity-tag-pill"
                        style={{ background: "#FEF3C7", color: "#B45309", fontWeight: 700, fontSize: "11.5px" }}
                      >
                        Follow-up suggested
                      </span>
                    ) : (
                      <span
                        className="clarity-tag-pill"
                        style={{ background: "#E6F7F5", color: "#0D7C7A", fontWeight: 700, fontSize: "11.5px" }}
                      >
                        Lower model score
                      </span>
                    )}
                  </td>

                  {/* Action Link (Image 1) */}
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewResultItem) {
                          onViewResultItem(item);
                        } else if (onOpenScreening) {
                          onOpenScreening(item.diseaseKey);
                        }
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--c-teal)",
                        fontWeight: 700,
                        fontSize: "12.5px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        padding: 0,
                      }}
                    >
                      <span>View results</span>
                      <span style={{ fontSize: "13px" }}>↗</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Bar (Image 1) */}
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12.5px",
            color: "var(--c-text-muted)",
          }}
        >
          <span>Showing 1–{filteredRecords.length} of {filteredRecords.length} sample records</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              className="clarity-btn-outline"
              style={{ padding: "4px 10px", fontSize: "12px" }}
              disabled
            >
              Previous
            </button>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: "var(--c-mint)",
                color: "var(--c-teal)",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              1
            </span>
            <button
              type="button"
              className="clarity-btn-outline"
              style={{ padding: "4px 10px", fontSize: "12px" }}
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Use Your History Thoughtfully Card (Image 1) */}
      <div
        style={{
          background: "#F0F9FF",
          border: "1px solid #BAE6FD",
          borderRadius: "10px",
          padding: "18px 22px",
          marginBottom: 20,
        }}
      >
        <h4 style={{ fontSize: "15px", fontWeight: 800, color: "var(--c-navy)", margin: "0 0 6px" }}>
          Use your history thoughtfully
        </h4>
        <p style={{ fontSize: "13px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 10px" }}>
          Scores from different screenings are not directly comparable and do not show a change in your health. A clinician can interpret symptoms and measurements over time.
        </p>
        {onGoToProfile && (
          <button
            type="button"
            onClick={onGoToProfile}
            style={{
              background: "none",
              border: "none",
              color: "var(--c-teal)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>Manage history and privacy in Profile</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Footer Medical Disclaimer (Image 1) */}
      <div style={{ fontSize: "11.5px", color: "var(--c-text-muted)", lineHeight: 1.6 }}>
        <div>QuantumDx screening decision support, not an autonomous clinical diagnosis. Seek medical advice from a qualified clinician.</div>
        <div>Illustrative demo only. Patient values, predictions and model statistics are evaluated against trained classical-quantum ensembles.</div>
      </div>
    </div>
  );
}
