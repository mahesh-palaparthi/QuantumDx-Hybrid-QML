import React from "react";

export default function ClarityAboutView({ onGoToScreening }) {
  return (
    <div className="clarity-content">
      {/* Top Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / About Us</span>
      </div>

      <h2 className="clarity-page-title">Health information. Human understanding.</h2>
      <p className="clarity-page-subtitle">
        Meet Clarity Health: an early-screening concept designed to make model comparisons easier to understand.
      </p>

      {/* Hero Card */}
      <div className="clarity-hero-card">
        <div className="clarity-hero-text">
          <div className="clarity-hero-tag">OUR PURPOSE</div>
          <h3 className="clarity-hero-title">Clarity for the conversation that comes next.</h3>
          <p className="clarity-hero-desc">
            Screening should help you ask better questions, not leave you with a number you don't understand. We bring two approaches to machine learning into one calm, explainable workspace.
          </p>
          <span className="clarity-tag-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
            DEMO CONCEPT - NOT A CLINICAL SERVICE
          </span>
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

      {/* One Screening. Two Perspectives. */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 4px", color: "var(--c-text-primary)" }}>
          One screening. Two perspectives.
        </h3>
        <p style={{ fontSize: "13px", color: "var(--c-text-muted)", margin: 0 }}>
          &quot;Hybrid&quot; here means a side-by-side comparison of Classical ML and Quantum ML — not a combined opaque black-box decision.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            📋
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            01 Share the context
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Choose one of four health areas, then enter symptoms and relevant clinical measurements. Child nutrition uses age-appropriate growth information.
          </p>
        </div>

        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            ⚙️
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            02 Compare approaches
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Classical ML finds patterns with conventional algorithms (SVM, Random Forest). Quantum ML explores a quantum-circuit ansatz in Hilbert space; this demo uses a state simulator.
          </p>
        </div>

        <div className="clarity-num-card">
          <div style={{ width: 36, height: 36, background: "var(--c-mint)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-teal)", fontSize: 18, marginBottom: 14 }}>
            🎯
          </div>
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
            03 Understand the why
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: 0 }}>
            Plain-language explanations, deadband consensus analysis, and feature contributions help you see which inputs influenced each illustrative result.
          </p>
        </div>
      </div>

      {/* Designed around four health areas & Disclaimers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 28 }}>
        <div className="clarity-num-card">
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 16px", color: "var(--c-text-primary)" }}>
            Designed around four health areas
          </h4>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "18px" }}>❤️</span>
              <div>
                <strong style={{ fontSize: "13px", color: "var(--c-text-primary)" }}>Heart Disease</strong>
                <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: "2px 0 0" }}>Symptoms and recent cardiovascular measurements.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "18px" }}>🎗️</span>
              <div>
                <strong style={{ fontSize: "13px", color: "var(--c-text-primary)" }}>Breast Cancer</strong>
                <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: "2px 0 0" }}>Cellular morphometry and relevant personal or family history.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "18px" }}>💧</span>
              <div>
                <strong style={{ fontSize: "13px", color: "var(--c-text-primary)" }}>Diabetes</strong>
                <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: "2px 0 0" }}>Glucose, metabolic factors and clinical indicators.</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: "18px" }}>👶</span>
              <div>
                <strong style={{ fontSize: "13px", color: "var(--c-text-primary)" }}>Pediatric Malnutrition</strong>
                <p style={{ fontSize: "12px", color: "var(--c-text-muted)", margin: "2px 0 0" }}>Caregiver-led growth and nutrition screening for ages 6–59 months.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="clarity-num-card">
          <h4 style={{ fontSize: "16px", fontWeight: 800, margin: "0 0 12px", color: "var(--c-text-primary)" }}>
            What this website cannot tell you
          </h4>
          <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 16px" }}>
            A machine learning model cannot examine you, confirm a clinical diagnosis, or choose your medical treatment. A low probability score does not rule out a condition, and a high score does not confirm one.
          </p>

          <div style={{ background: "var(--c-amber-bg)", border: "1px solid var(--c-amber-border)", borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>🩺</span>
            <div>
              <strong style={{ fontSize: "12.5px", color: "var(--c-amber-text)", display: "block" }}>Always keep your care team involved</strong>
              <span style={{ fontSize: "11.5px", color: "#78350F" }}>
                Speak with a qualified clinician about symptoms or concerns, whatever a screening tool says. For acute emergencies, seek immediate hospital care.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
