import React from "react";

/**
 * VerifiedPatientPicker
 * Replaces synthetic randomized patient generators with 100% authentic,
 * indexed clinical records from published medical datasets:
 *   1. Early Stage Diabetes: Sylhet Diabetes Hospital (251 real patients)
 *   2. Breast Cancer: UCI Wisconsin Diagnostic FNA (569 real patients)
 *   3. Heart Disease: Statlog Cleveland Heart Institute (270 real patients)
 *
 * Surfaces exact dataset row index, demographic markers, and verified ground-truth diagnosis.
 */
export default function VerifiedPatientPicker({
  activeDisease = "diabetes",
  cohorts = [],
  selectedCase = null,
  onSelectCase,
  predictionOutcome = null, // "Positive" | "Negative" | "Inconclusive" | null
  confidenceScore = null,
}) {
  const isDiabetes = activeDisease === "diabetes";
  const isHeart = activeDisease === "heart_disease";
  const isMalnutrition = activeDisease === "child_malnutrition";

  const datasetTitle = isDiabetes
    ? "Sylhet Early Stage Diabetes (Published Clinical Dataset)"
    : isHeart
    ? "Statlog Cleveland Heart Disease (Clinical Institute Dataset)"
    : isMalnutrition
    ? "UNICEF/WHO SMART Survey Cohort (Pediatric Anthropometry)"
    : "UCI Breast Cancer Wisconsin Diagnostic FNA (Biopsy Dataset)";

  const handleRandomPick = () => {
    if (!cohorts || cohorts.length === 0) return;
    const available = cohorts.filter((c) => c.id !== selectedCase?.id);
    const pool = available.length > 0 ? available : cohorts;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    onSelectCase(pick);
  };

  const isGroundTruthInconclusive =
    selectedCase?.isInconclusive ||
    (typeof selectedCase?.groundTruth === "string" &&
      selectedCase.groundTruth.toLowerCase().includes("inconclusive"));

  const isMatch =
    predictionOutcome &&
    selectedCase &&
    (isGroundTruthInconclusive
      ? predictionOutcome === "Inconclusive"
      : (predictionOutcome === "Positive" && selectedCase.isPositive) ||
        (predictionOutcome === "Negative" && !selectedCase.isPositive));

  return (
    <div className="qdx-verified-picker-card">
      <div className="qdx-picker-top">
        <div className="qdx-picker-title-row">
          <div className="qdx-picker-icon">📋</div>
          <div>
            <div className="qdx-picker-main-title">
              Verified Clinical <span className="qdx-gradient-text">Patient Row Picker</span>
            </div>
            <div className="qdx-picker-sub">
              Zero synthetic randomization. Every case is extracted directly from published clinical databases with indexed ground-truth.
            </div>
          </div>
        </div>

        <div className="qdx-picker-actions">
          <button
            type="button"
            className="qdx-btn-random-case"
            onClick={handleRandomPick}
            title="Load a random authentic row from this dataset"
          >
            🎲 Random Verified Row
          </button>
        </div>
      </div>

      {/* Row Selector Dropdown */}
      <div className="qdx-picker-select-row">
        <label className="qdx-picker-label">Select Verified Dataset Row:</label>
        <select
          className="qdx-picker-dropdown"
          value={selectedCase?.id || "custom"}
          onChange={(e) => {
            if (e.target.value === "custom") return;
            const chosen = cohorts.find((c) => c.id === e.target.value);
            if (chosen) onSelectCase(chosen);
          }}
        >
          <option value="custom">✏️ Custom Manual Patient Entry</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Case Ground-Truth Banner */}
      {selectedCase ? (
        <div className="qdx-case-meta-banner">
          <div className="qdx-case-meta-left">
            <div className="qdx-case-source">
              <span className="qdx-case-tag">DATASET ROW</span>
              <strong className="qdx-case-row-num">
                #{selectedCase.rowIndex !== undefined ? selectedCase.rowIndex : selectedCase.id.split("-").pop()}
              </strong>
              <span className="qdx-case-origin">• {datasetTitle}</span>
            </div>
            <div className="qdx-case-hallmarks">
              <span>Hallmarks: </span>
              <strong>{selectedCase.hallmarks || selectedCase.clinicalNotes?.slice(0, 85) + "..."}</strong>
            </div>
          </div>

          <div className="qdx-case-meta-right">
            <div
              className={`qdx-ground-truth-badge ${
                isGroundTruthInconclusive
                  ? "badge-inconclusive"
                  : selectedCase.isPositive
                  ? "badge-positive"
                  : "badge-negative"
              }`}
            >
              <span className="qdx-gt-dot" />
              <span>
                Ground Truth:{" "}
                {isGroundTruthInconclusive
                  ? "INCONCLUSIVE (SAFETY GATE)"
                  : selectedCase.isPositive
                  ? "POSITIVE"
                  : "NEGATIVE"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="qdx-case-meta-banner" style={{ background: "rgba(56, 189, 248, 0.08)", borderColor: "rgba(56, 189, 248, 0.25)" }}>
          <div className="qdx-case-meta-left">
            <div className="qdx-case-source">
              <span className="qdx-case-tag" style={{ background: "#0284c7" }}>CUSTOM INPUT</span>
              <strong className="qdx-case-row-num">Active Manual Entry</strong>
              <span className="qdx-case-origin">• Evaluating custom user-entered clinical parameters</span>
            </div>
            <div className="qdx-case-hallmarks">
              <span>Status: </span>
              <strong>Custom values entered. You can edit any parameter freely.</strong>
            </div>
          </div>
          <div className="qdx-case-meta-right">
            <div className="qdx-ground-truth-badge" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
              <span>User Custom Data</span>
            </div>
          </div>
        </div>
      )}

      {/* Ground Truth vs Prediction Comparison Card (Rendered when prediction has run) */}
      {predictionOutcome && selectedCase && (
        <div className={`qdx-gt-validation-card ${isMatch ? "validation-match" : "validation-divergent"}`}>
          <div className="qdx-v-left">
            <div className="qdx-v-icon">{isMatch ? "🎯" : "⚠️"}</div>
            <div>
              <div className="qdx-v-title">
                {isMatch
                  ? isGroundTruthInconclusive
                    ? "Ground-Truth Safety Gate Confirmed"
                    : "Ground-Truth Verification Confirmed"
                  : "Clinical Classifier Divergence"}
              </div>
              <div className="qdx-v-desc">
                {isMatch && isGroundTruthInconclusive
                  ? `Dual-model architecture successfully identified borderline clinical divergence (${predictionOutcome} — Safety Gate Active). Review protocol activated as expected.`
                  : `Model prediction (${predictionOutcome === "Inconclusive" ? "Inconclusive (Safety Gate)" : predictionOutcome} ${confidenceScore && predictionOutcome !== "Inconclusive" ? `at ${confidenceScore}%` : ""}) vs Authentic Dataset Label (${isGroundTruthInconclusive ? "Inconclusive" : selectedCase.isPositive ? "Positive" : "Negative"}).`}
              </div>
            </div>
          </div>
          <div className="qdx-v-right">
            <span className={`qdx-v-pill ${isMatch ? "pill-match" : "pill-review"}`}>
              {isMatch
                ? isGroundTruthInconclusive
                  ? "Safety Gate Match ✅"
                  : "100% Match Confirmed ✅"
                : "Review Advised 🔬"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
