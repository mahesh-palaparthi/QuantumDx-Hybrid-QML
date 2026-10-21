import React from "react";

export default function ClarityProfileView({ user, onLogout, onOpenAuth }) {
  if (!user) {
    return (
      <div className="clarity-content">
        <div className="clarity-breadcrumb">
          <span className="clarity-breadcrumb-text">Home / User Profile</span>
        </div>
        <h2 className="clarity-page-title">User Account</h2>
        <p className="clarity-page-subtitle">Access your clinical workspace and screening records.</p>

        <div className="clarity-num-card" style={{ textAlign: "center", padding: "60px 24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: 12 }}>👤</span>
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px" }}>Not Signed In</h3>
          <p style={{ fontSize: "14px", color: "var(--c-text-secondary)", maxWidth: 440, margin: "0 auto 20px" }}>
            Sign in or create a demo account to persist your clinical screening history securely.
          </p>
          <button
            type="button"
            className="clarity-btn-primary"
            onClick={onOpenAuth}
          >
            Sign In / Register →
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AM";

  return (
    <div className="clarity-content">
      {/* Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / User Profile</span>
      </div>

      <h2 className="clarity-page-title">Clinician Profile</h2>
      <p className="clarity-page-subtitle">Manage your credentials, active role and workspace session.</p>

      {/* Profile Overview Card */}
      <div className="clarity-num-card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--c-teal)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--c-navy)" }}>
                {user.fullName || user.name || "Alex Morgan"}
              </h3>
              <span className="clarity-tag-pill" style={{ background: "var(--c-mint)", color: "var(--c-teal)", fontWeight: 700 }}>
                {user.role || "Clinical Reviewer"}
              </span>
            </div>
            <p style={{ margin: "4px 0 0", color: "var(--c-text-secondary)", fontSize: "14px" }}>
              {user.email || "alex.morgan@example.com"}
            </p>
          </div>
          <div>
            <button
              type="button"
              className="clarity-btn-outline"
              onClick={onLogout}
              style={{ color: "#dc2626", borderColor: "#fca5a5" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="clarity-form-grid">
        <div className="clarity-form-main">
          <div className="clarity-num-card">
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 16px", color: "var(--c-text-primary)" }}>
              Workspace Details
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "13.5px" }}>
              <div>
                <span style={{ color: "var(--c-text-muted)", display: "block", fontSize: "12px" }}>WORKSPACE ID</span>
                <span style={{ fontWeight: 600 }}>WS-DEMO-2026-QML</span>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)", display: "block", fontSize: "12px" }}>SECURITY STANDARD</span>
                <span style={{ fontWeight: 600 }}>PBKDF2 SHA-256 Auth</span>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)", display: "block", fontSize: "12px" }}>QUANTUM KERNEL ENGINE</span>
                <span style={{ fontWeight: 600 }}>Qiskit Aer (4 Qubits)</span>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)", display: "block", fontSize: "12px" }}>SAFETY GATE TOLERANCE</span>
                <span style={{ fontWeight: 600 }}>&Delta; &ge; 45% (Inconclusive)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="clarity-support-cards">
          <div className="clarity-support-card">
            <div className="clarity-support-title">Privacy & Compliance</div>
            <p className="clarity-support-text">
              Patient data inputs are processed in-memory for model inferences and logged exclusively to your authenticated local database session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
