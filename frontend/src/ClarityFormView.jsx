import React from "react";
import VerifiedPatientPicker from "./VerifiedPatientPicker";

export default function ClarityFormView({
  activeDisease,
  onBackToHub,
  onGoToBenchmarks,
  diabetesData,
  updateDiabetesField,
  heartData,
  updateHeartField,
  malnutritionData,
  updateMalnutritionField,
  cancerFeatures,
  updateCancerField,
  onAnalyze,
  loading,
  error,
  activeCohorts,
  selectedCohortCase,
  onSelectCohortCase,
}) {
  const isHeart = activeDisease === "heart_disease";
  const isMalnutrition = activeDisease === "child_malnutrition";
  const isCancer = activeDisease === "breast_cancer";
  const isDiabetes = activeDisease === "diabetes";

  const diseaseTitles = {
    heart_disease: "Heart Disease screening",
    breast_cancer: "Breast Cancer screening",
    diabetes: "Diabetes Mellitus screening",
    child_malnutrition: "Pediatric Malnutrition screening",
  };

  const diseaseSubtitles = {
    heart_disease: "Tell us about your symptoms and recent heart health measurements.",
    breast_cancer: "Share breast symptoms and relevant history. This does not replace an exam or mammogram.",
    diabetes: "Enter metabolic indicators and osmotic symptoms for classical and quantum dual screening.",
    child_malnutrition: "A supportive check of a child's growth and nutrition, completed by a parent or caregiver.",
  };

  return (
    <div className="clarity-content">
      {/* Breadcrumb & Title */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">
          <span style={{ cursor: "pointer", color: "var(--c-teal)" }} onClick={onBackToHub}>
            Disease Prediction
          </span>{" "}
          / {isHeart ? "Heart Disease" : isCancer ? "Breast Cancer" : isMalnutrition ? "Pediatric Malnutrition" : "Diabetes"}
        </span>
        <span className="clarity-tag-pill">ILLUSTRATIVE SAMPLE</span>
      </div>

      <h2 className="clarity-page-title">{diseaseTitles[activeDisease]}</h2>
      <p className="clarity-page-subtitle">{diseaseSubtitles[activeDisease]}</p>

      {/* 3-Step Process Track */}
      <div className="clarity-steps-track">
        <div className="clarity-step-item completed">
          <div className="clarity-step-dot">✓</div>
          <span style={{ color: "#10B981" }}>Category selected</span>
        </div>

        <div style={{ color: "#CBD5E1" }}>→</div>

        <div className="clarity-step-item active">
          <div className="clarity-step-dot">02</div>
          <span style={{ color: "var(--c-teal)", fontWeight: 700 }}>Health information</span>
        </div>

        <div style={{ color: "#CBD5E1" }}>→</div>

        <div className="clarity-step-item">
          <div className="clarity-step-dot">03</div>
          <span>Compare results</span>
        </div>
      </div>

      {/* Blue Prefill Info Banner */}
      <div className="clarity-alert clarity-alert-blue">
        <span style={{ fontSize: "16px" }}>ⓘ</span>
        <div>
          All fields marked * are required. You can choose any published clinical dataset case below or enter custom manual values to test the dual-model screening engine.
        </div>
      </div>

      {error && (
        <div className="clarity-alert clarity-alert-amber" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}>
          <span>⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="clarity-studio-layout">
        {/* Left Column: Numbered Cards */}
        <div className="clarity-form-column">
          {/* =========================================================
              HEART DISEASE FORM (Figma Matched)
              ========================================================= */}
          {isHeart && (
            <>
              {/* Card 01: About you */}
              <div className="clarity-num-card">
                <div className="clarity-card-head">
                  <div className="clarity-num-badge">01</div>
                  <div className="clarity-card-titles">
                    <h3 className="clarity-card-title">About you</h3>
                    <p className="clarity-card-desc">Sample demographic profile. Values shown are illustrative.</p>
                  </div>
                </div>

                <div className="clarity-inputs-grid">
                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Age <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={heartData.age}
                        onChange={(e) => updateHeartField("age", e.target.value)}
                        min="18"
                        max="100"
                      />
                      <span className="clarity-input-unit">years</span>
                    </div>
                    <span className="clarity-field-helper">Adults 18–100 years.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Sex recorded at birth <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.sex}
                      onChange={(e) => updateHeartField("sex", e.target.value)}
                    >
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                    <span className="clarity-field-helper">Used as a model input; not gender identity.</span>
                  </div>
                </div>
              </div>

              {/* Card 02: Symptoms and history */}
              <div className="clarity-num-card">
                <div className="clarity-card-head">
                  <div className="clarity-num-badge">02</div>
                  <div className="clarity-card-titles">
                    <h3 className="clarity-card-title">Symptoms and history</h3>
                    <p className="clarity-card-desc">Choose the option that best describes current experience.</p>
                  </div>
                </div>

                <div className="clarity-inputs-grid">
                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Chest discomfort <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.chest}
                      onChange={(e) => updateHeartField("chest", e.target.value)}
                    >
                      <option value="1">Typical Angina</option>
                      <option value="2">Atypical Angina</option>
                      <option value="3">Non-Anginal Pain</option>
                      <option value="4">Asymptomatic / Pressure</option>
                    </select>
                    <span className="clarity-field-helper">Chest discomfort type.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Exercise-related chest pain <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.exercise_induced_angina}
                      onChange={(e) => updateHeartField("exercise_induced_angina", e.target.value)}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                    <span className="clarity-field-helper">Induced by exertion.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Fasting blood sugar &gt; 120 <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.fasting_blood_sugar}
                      onChange={(e) => updateHeartField("fasting_blood_sugar", e.target.value)}
                    >
                      <option value="1">Yes (&gt;120 mg/dl)</option>
                      <option value="0">No (Normal &le;120 mg/dl)</option>
                    </select>
                    <span className="clarity-field-helper">Elevated glucose marker.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Resting ECG result <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.resting_electrocardiographic_results}
                      onChange={(e) => updateHeartField("resting_electrocardiographic_results", e.target.value)}
                    >
                      <option value="0">Normal</option>
                      <option value="1">ST-T wave abnormality</option>
                      <option value="2">Left ventricular hypertrophy</option>
                    </select>
                    <span className="clarity-field-helper">Electrocardiogram reading.</span>
                  </div>
                </div>
              </div>

              {/* Card 03: Health measurements */}
              <div className="clarity-num-card">
                <div className="clarity-card-head">
                  <div className="clarity-num-badge">03</div>
                  <div className="clarity-card-titles">
                    <h3 className="clarity-card-title">Health measurements</h3>
                    <p className="clarity-card-desc">Use latest recorded clinical cardiology values.</p>
                  </div>
                </div>

                <div className="clarity-inputs-grid">
                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Resting blood pressure <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={heartData.resting_blood_pressure}
                        onChange={(e) => updateHeartField("resting_blood_pressure", e.target.value)}
                      />
                      <span className="clarity-input-unit">mmHg</span>
                    </div>
                    <span className="clarity-field-helper">Expected range 70–250 mmHg.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Serum cholesterol <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={heartData.serum_cholestoral}
                        onChange={(e) => updateHeartField("serum_cholestoral", e.target.value)}
                      />
                      <span className="clarity-input-unit">mg/dL</span>
                    </div>
                    <span className="clarity-field-helper">Total cholesterol level.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Maximum heart rate <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={heartData.maximum_heart_rate_achieved}
                        onChange={(e) => updateHeartField("maximum_heart_rate_achieved", e.target.value)}
                      />
                      <span className="clarity-input-unit">bpm</span>
                    </div>
                    <span className="clarity-field-helper">Peak exercise heart rate.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      ST depression (oldpeak) <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        step="0.1"
                        className="clarity-input"
                        value={heartData.oldpeak}
                        onChange={(e) => updateHeartField("oldpeak", e.target.value)}
                      />
                      <span className="clarity-input-unit">mm</span>
                    </div>
                    <span className="clarity-field-helper">ST depression induced by exercise.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Slope of peak exercise ST <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.slope}
                      onChange={(e) => updateHeartField("slope", e.target.value)}
                    >
                      <option value="1">Upsloping</option>
                      <option value="2">Flat</option>
                      <option value="3">Downsloping</option>
                    </select>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Major vessels colored (0-3) <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={heartData.number_of_major_vessels}
                      onChange={(e) => updateHeartField("number_of_major_vessels", e.target.value)}
                    >
                      <option value="0">0 vessels</option>
                      <option value="1">1 vessel</option>
                      <option value="2">2 vessels</option>
                      <option value="3">3 vessels</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =========================================================
              PEDIATRIC MALNUTRITION FORM (Figma Matched)
              ========================================================= */}
          {isMalnutrition && (
            <>
              {/* Card 01: Caregiver and child */}
              <div className="clarity-num-card">
                <div className="clarity-card-head">
                  <div className="clarity-num-badge">01</div>
                  <div className="clarity-card-titles">
                    <h3 className="clarity-card-title">Caregiver and child</h3>
                    <p className="clarity-card-desc">Anthropometric growth profile. No identifying personal data is stored.</p>
                  </div>
                </div>

                <div className="clarity-inputs-grid">
                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Age <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={malnutritionData.age_months}
                        onChange={(e) => updateMalnutritionField("age_months", e.target.value)}
                        min="6"
                        max="59"
                      />
                      <span className="clarity-input-unit">months</span>
                    </div>
                    <span className="clarity-field-helper">Completed months · Supported range 6–59.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Sex recorded at birth <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={malnutritionData.sex}
                      onChange={(e) => updateMalnutritionField("sex", e.target.value)}
                    >
                      <option value="1">Male</option>
                      <option value="0">Female</option>
                    </select>
                    <span className="clarity-field-helper">WHO gender-calibrated growth standard.</span>
                  </div>
                </div>
              </div>

              {/* Card 02: Growth measurements */}
              <div className="clarity-num-card">
                <div className="clarity-card-head">
                  <div className="clarity-num-badge">02</div>
                  <div className="clarity-card-titles">
                    <h3 className="clarity-card-title">Growth measurements</h3>
                    <p className="clarity-card-desc">Measurements based on WHO/UNICEF clinical field standards.</p>
                  </div>
                </div>

                <div className="clarity-inputs-grid">
                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Weight <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        step="0.1"
                        className="clarity-input"
                        value={malnutritionData.weight_kg}
                        onChange={(e) => updateMalnutritionField("weight_kg", e.target.value)}
                      />
                      <span className="clarity-input-unit">kg</span>
                    </div>
                    <span className="clarity-field-helper">Calibrated digital scale · Range 2–30 kg.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Length / height <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        step="0.5"
                        className="clarity-input"
                        value={malnutritionData.height_cm}
                        onChange={(e) => updateMalnutritionField("height_cm", e.target.value)}
                      />
                      <span className="clarity-input-unit">cm</span>
                    </div>
                    <span className="clarity-field-helper">Standing height from 24mo; recumbent length below 24mo.</span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Mid-upper arm tape (MUAC) <span className="clarity-required-star">*</span>
                    </label>
                    <div className="clarity-input-wrap">
                      <input
                        type="number"
                        className="clarity-input"
                        value={malnutritionData.muac_mm}
                        onChange={(e) => updateMalnutritionField("muac_mm", e.target.value)}
                      />
                      <span className="clarity-input-unit">mm</span>
                    </div>
                    <span className="clarity-field-helper">
                      {Number(malnutritionData.muac_mm) < 115
                        ? "🔴 Red Band (<115mm: Severe Wasting SAM)"
                        : Number(malnutritionData.muac_mm) <= 125
                        ? "🟡 Yellow Band (115-125mm: Moderate MAM)"
                        : "🟢 Green Band (>125mm: Normal Growth)"}
                    </span>
                  </div>

                  <div className="clarity-field-group">
                    <label className="clarity-field-label">
                      Bilateral pitting edema <span className="clarity-required-star">*</span>
                    </label>
                    <select
                      className="clarity-select"
                      value={malnutritionData.edema}
                      onChange={(e) => updateMalnutritionField("edema", e.target.value)}
                    >
                      <option value="0">No (Absence of edema)</option>
                      <option value="1">Yes (Nutritional Kwashiorkor)</option>
                    </select>
                    <span className="clarity-field-helper">Bilateral lower extremity fluid retention.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* =========================================================
              DIABETES FORM (16 Symptoms)
              ========================================================= */}
          {isDiabetes && (
            <div className="clarity-num-card">
              <div className="clarity-card-head">
                <div className="clarity-num-badge">01</div>
                <div className="clarity-card-titles">
                  <h3 className="clarity-card-title">Metabolic Symptoms &amp; History</h3>
                  <p className="clarity-card-desc">Everyday language clinical indicators evaluated by Classical SVM and Quantum QNN.</p>
                </div>
              </div>

              <div className="clarity-inputs-grid">
                <div className="clarity-field-group">
                  <label className="clarity-field-label">Age *</label>
                  <div className="clarity-input-wrap">
                    <input
                      type="number"
                      className="clarity-input"
                      value={diabetesData.Age}
                      onChange={(e) => updateDiabetesField("Age", e.target.value)}
                    />
                    <span className="clarity-input-unit">years</span>
                  </div>
                </div>

                <div className="clarity-field-group">
                  <label className="clarity-field-label">Gender *</label>
                  <select
                    className="clarity-select"
                    value={diabetesData.Gender}
                    onChange={(e) => updateDiabetesField("Gender", e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {[
                  ["Polyuria", "Frequent Urination (Polyuria)"],
                  ["Polydipsia", "Excessive Thirst (Polydipsia)"],
                  ["sudden_weight_loss", "Sudden Weight Loss"],
                  ["weakness", "Chronic Fatigue / Weakness"],
                  ["Polyphagia", "Excessive Hunger (Polyphagia)"],
                  ["Genital_thrush", "Genital Thrush / Yeast"],
                  ["visual_blurring", "Visual Blurring"],
                  ["Itching", "Persistent Itching"],
                  ["Irritability", "Mood Changes / Irritability"],
                  ["delayed_healing", "Delayed Wound Healing"],
                  ["partial_paresis", "Numbness / Partial Paresis"],
                  ["muscle_stiffness", "Muscle Stiffness"],
                  ["Alopecia", "Hair Loss / Alopecia"],
                  ["Obesity", "Obesity (High BMI)"],
                ].map(([key, label]) => (
                  <div key={key} className="clarity-field-group">
                    <label className="clarity-field-label">{label} *</label>
                    <select
                      className="clarity-select"
                      value={diabetesData[key]}
                      onChange={(e) => updateDiabetesField(key, e.target.value)}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              BREAST CANCER FORM
              ========================================================= */}
          {isCancer && (
            <div className="clarity-num-card">
              <div className="clarity-card-head">
                <div className="clarity-num-badge">01</div>
                <div className="clarity-card-titles">
                  <h3 className="clarity-card-title">Cellular Morphometric Attributes</h3>
                  <p className="clarity-card-desc">Wisconsin Diagnostic Breast Cancer (WDBC) 30 fine needle aspirate (FNA) measurements.</p>
                </div>
              </div>

              <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 6 }}>
                <div className="clarity-inputs-grid">
                  {cancerFeatures.map((val, idx) => (
                    <div key={idx} className="clarity-field-group">
                      <label className="clarity-field-label">Feature #{idx + 1}</label>
                      <input
                        type="number"
                        step="any"
                        className="clarity-input"
                        value={val}
                        onChange={(e) => updateCancerField(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Card: Cohort Picker & Submit */}
          <div className="clarity-action-card">
            <div>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--c-text-muted)", display: "block", marginBottom: 6 }}>
                QUICK VERIFICATION: PUBLISHED BENCHMARK COHORT
              </label>
              <VerifiedPatientPicker
                cohorts={activeCohorts}
                selectedCase={selectedCohortCase}
                onSelectCase={onSelectCohortCase}
                activeDisease={activeDisease}
              />
            </div>

            <button
              type="button"
              className="clarity-submit-btn"
              onClick={onAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="qdx-spin-icon" style={{ fontSize: "16px" }}>⚛️</span>
                  <span>Executing Dual QML Inference...</span>
                </>
              ) : (
                <>
                  <span>Run Disease Detection</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Support Cards */}
        <div className="clarity-right-col">
          {/* Card 1: Before you start */}
          <div className="clarity-support-card">
            <h4 className="clarity-support-title">
              <span style={{ color: "var(--c-teal)" }}>📋</span> Before you start
            </h4>
            <ul className="clarity-checklist">
              <li className="clarity-check-item">
                <span className="clarity-check-icon">✓</span>
                <span>Your age and relevant clinical history</span>
              </li>
              <li className="clarity-check-item">
                <span className="clarity-check-icon">✓</span>
                <span>Recent blood pressure and test values</span>
              </li>
              <li className="clarity-check-item">
                <span className="clarity-check-icon">✓</span>
                <span>Calibrated measurements where available</span>
              </li>
            </ul>
            <p className="clarity-support-note">
              Use measurements from a recent medical check-up. If a required value is unavailable, consult a healthcare provider.
            </p>
          </div>

          {/* Card 2: Get care when you need it */}
          <div className="clarity-support-card amber">
            <h4 className="clarity-support-title" style={{ color: "#92400E" }}>
              <span>⚠️</span> Get care when you need it
            </h4>
            <p className="clarity-support-note" style={{ color: "#78350F" }}>
              Chest pain at rest, severe breathlessness or acute pediatric distress needs urgent medical care. Do not use this tool for emergency evaluation.
            </p>
          </div>

          {/* Card 3: Model benchmarks link */}
          <div className="clarity-support-card">
            <h4 className="clarity-support-title">
              <span>📊</span> Curious about the models?
            </h4>
            <p className="clarity-support-note" style={{ marginBottom: 12 }}>
              Explore the illustrative metrics, hardware trade-offs, and 5-fold cross-validation results.
            </p>
            <button
              type="button"
              onClick={onGoToBenchmarks}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--c-teal)",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>View model benchmarks</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
