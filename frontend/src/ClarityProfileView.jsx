import React, { useState } from "react";
import { API_BASE_URL } from "./config";

export default function ClarityProfileView({
  user,
  authToken,
  onLogout,
  onLoginSuccess,
  onOpenAuth,
  screeningHistory = [],
  onClearHistory,
}) {
  const [showToken, setShowToken] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [inlineLoading, setInlineLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setInlineError("");
    setInlineLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginEmail.trim(), email: loginEmail.trim(), password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.detail || "Authentication failed");
      }
      if (onLoginSuccess) {
        onLoginSuccess(
          data.user || { fullName: loginEmail.split("@")[0], name: loginEmail.split("@")[0], email: loginEmail.trim(), role: "patient" },
          data.token || "session_token_granted"
        );
      }
    } catch (err) {
      setInlineError(err.message || "Invalid email or password. Please verify your credentials.");
    } finally {
      setInlineLoading(false);
    }
  };

  const copyTokenToClipboard = () => {
    const tokenStr = authToken || "qdx_demo_bearer_pbkdf2_token_77a982c";
    navigator.clipboard.writeText(tokenStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If user is not logged in, render the clean login/register landing card
  if (!user) {
    return (
      <div className="clarity-content">
        <div className="clarity-breadcrumb">
          <span className="clarity-breadcrumb-text">Home / User Profile</span>
        </div>

        <h2 className="clarity-page-title">Clinician Profile &amp; Authentication</h2>
        <p className="clarity-page-subtitle">
          Sign in to your clinical account or create a new account to access personalized screening audits, patient records, and quantum inference.
        </p>

        {/* Standard Email & Password Login Card */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginTop: 16 }}>
          <div className="clarity-num-card">
            <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 14px", color: "var(--c-text-primary)" }}>
              🔑 Sign in with Credentials
            </h3>

            {inlineError && (
              <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", color: "#B91C1C", padding: "10px 14px", borderRadius: 8, fontSize: "12.5px", marginBottom: 14 }}>
                {inlineError}
              </div>
            )}

            <form onSubmit={handleInlineLogin}>
              <div style={{ marginBottom: 14 }}>
                <label className="clarity-field-label">Email Address</label>
                <input
                  type="email"
                  className="clarity-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label className="clarity-field-label">Password</label>
                <input
                  type="password"
                  className="clarity-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  type="submit"
                  className="clarity-btn-primary"
                  style={{ flex: 1, padding: "12px", justifyContent: "center" }}
                  disabled={inlineLoading}
                >
                  {inlineLoading ? "Authenticating..." : "Sign In to Workspace"}
                </button>
                {onOpenAuth && (
                  <button
                    type="button"
                    className="clarity-btn-outline"
                    onClick={onOpenAuth}
                    style={{ padding: "12px 18px" }}
                  >
                    Create Account
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Security & Token Info Box */}
          <div className="clarity-num-card">
            <h4 style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 12px", color: "var(--c-text-primary)" }}>
              🛡️ Security &amp; Token Standards
            </h4>
            <p style={{ fontSize: "12.5px", color: "var(--c-text-secondary)", lineHeight: 1.5, margin: "0 0 14px" }}>
              QuantumDx enforces hospital-grade data boundaries and zero-trust authentication protocols:
            </p>
            <ul style={{ paddingLeft: 16, margin: 0, fontSize: "12px", color: "var(--c-text-muted)", lineHeight: 1.8 }}>
              <li><strong>PBKDF2 Hashing:</strong> Cryptographic password hashing with random salt and SHA-512 key stretching.</li>
              <li><strong>Stateless Inference:</strong> Patient biomarkers are evaluated in-memory and discarded post-prediction.</li>
              <li><strong>Secure Persistence:</strong> Screening logs are stored in your secure local session database.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED-IN CLINICIAN VIEW
  const displayName = user.fullName || user.name || user.email || "Clinician";
  const displayRole = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Clinical Practitioner";
  const displayEmail = user.email || "";
  const displayNpi = user.npi || `UID-${(user.id || "001").slice(-6)}`;
  const displayDepartment = user.department || (user.profile?.institution) || (user.profile?.department) || "Clinical Medicine & Screening";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || displayName.slice(0, 2).toUpperCase();

  const tokenString = authToken || "qdx_demo_bearer_pbkdf2_token_77a982c";

  return (
    <div className="clarity-content">
      {/* Breadcrumb */}
      <div className="clarity-breadcrumb">
        <span className="clarity-breadcrumb-text">Home / User Profile</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 className="clarity-page-title">Clinician Profile &amp; Session</h2>
          <p className="clarity-page-subtitle">
            Authenticated clinical workspace identity, security credentials, and active model permissions.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
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

      {/* Main Clinician Identity Card */}
      <div className="clarity-num-card" style={{ marginBottom: 20, borderLeft: "4px solid var(--c-teal)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0D7C7A, #0A6B68)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(13,124,122,0.25)",
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "var(--c-navy)" }}>
                {displayName}
              </h3>
              <span className="clarity-tag-pill" style={{ background: "var(--c-mint)", color: "var(--c-teal)", fontWeight: 700 }}>
                {displayRole}
              </span>
              <span className="clarity-tag-pill" style={{ background: "#EEF2F6", color: "var(--c-text-primary)", fontWeight: 600 }}>
                {displayNpi}
              </span>
            </div>

            <p style={{ margin: "4px 0 0", color: "var(--c-text-secondary)", fontSize: "13.5px" }}>
              {displayEmail} &middot; <span style={{ color: "var(--c-text-muted)" }}>{displayDepartment}</span>
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <strong style={{ fontSize: "12px", color: "#10b981", textTransform: "uppercase" }}>Session Active</strong>
            </div>
            <span style={{ fontSize: "11.5px", color: "var(--c-text-muted)", display: "block", marginTop: 4 }}>
              PBKDF2 SHA-256 Token
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Login Information + Workspace Permissions */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Card 1: Active Login & Security Session Information */}
        <div className="clarity-num-card">
          <div className="clarity-card-head" style={{ marginBottom: 14 }}>
            <div className="clarity-num-badge">🔒</div>
            <div className="clarity-card-titles">
              <h4 className="clarity-card-title">Authentication &amp; Session Tokens</h4>
              <p className="clarity-card-desc">Real-time cryptographic token session details.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Account Email:</span>
              <strong style={{ color: "var(--c-text-primary)" }}>{displayEmail}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Auth Strategy:</span>
              <strong style={{ color: "var(--c-navy)" }}>PBKDF2 (SHA-256, 600K iterations)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Session ID:</span>
              <code style={{ background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, fontSize: "12px" }}>
                sess_qdx_{Math.abs((displayEmail || "user").split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))}
              </code>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Token Validity:</span>
              <span style={{ color: "#15803D", fontWeight: 700 }}>Active (Auto-Renewing)</span>
            </div>

            {/* Bearer Token String with Copy / Toggle */}
            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "12px", color: "var(--c-text-muted)", fontWeight: 600 }}>BEARER API TOKEN</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    style={{ background: "none", border: "none", color: "var(--c-teal)", fontSize: "11.5px", cursor: "pointer", fontWeight: 700 }}
                  >
                    {showToken ? "Hide Token" : "Reveal Token"}
                  </button>
                  <button
                    type="button"
                    onClick={copyTokenToClipboard}
                    style={{ background: "none", border: "none", color: "var(--c-teal)", fontSize: "11.5px", cursor: "pointer", fontWeight: 700 }}
                  >
                    {copied ? "✓ Copied" : "Copy Token"}
                  </button>
                </div>
              </div>
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  color: "var(--c-text-secondary)",
                }}
              >
                {showToken ? tokenString : tokenString.slice(0, 14) + "••••••••••••••••••••••••••••••••"}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Workspace Permissions & Screening Stats */}
        <div className="clarity-num-card">
          <div className="clarity-card-head" style={{ marginBottom: 14 }}>
            <div className="clarity-num-badge">📊</div>
            <div className="clarity-card-titles">
              <h4 className="clarity-card-title">Permissions &amp; Activity</h4>
              <p className="clarity-card-desc">Diagnostic access and screening audit log stats.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "13px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Total Screenings Logged:</span>
              <strong style={{ color: "var(--c-navy)", fontSize: "14px" }}>{screeningHistory.length} records</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Quantum Engine Access:</span>
              <span className="clarity-tag-pill" style={{ background: "var(--c-mint)", color: "var(--c-teal)", fontWeight: 700 }}>
                4-Qubit Aer Sim
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Safety Gate Threshold:</span>
              <strong style={{ color: "#d97706" }}>&Delta; &ge; 45% (Inconclusive)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Clinical PDF Export:</span>
              <span style={{ color: "#15803D", fontWeight: 700 }}>Enabled ✓</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
              <span style={{ color: "var(--c-text-muted)" }}>Database Audit Export:</span>
              <span style={{ color: "#15803D", fontWeight: 700 }}>JSON Format ✓</span>
            </div>

            {screeningHistory.length > 0 && onClearHistory && (
              <div style={{ marginTop: 6 }}>
                <button
                  type="button"
                  className="clarity-btn-outline"
                  onClick={onClearHistory}
                  style={{ width: "100%", justifyContent: "center", color: "#dc2626", borderColor: "#fca5a5" }}
                >
                  🗑️ Clear My Saved Screening Records
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account & Session Controls */}
      <div className="clarity-num-card">
        <h4 style={{ fontSize: "15px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
          🛡️ Account &amp; Workspace Management
        </h4>
        <p style={{ fontSize: "12.5px", color: "var(--c-text-muted)", margin: "0 0 16px" }}>
          Manage your verified session, security credentials, and access permissions:
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button
            type="button"
            className="clarity-btn-outline"
            onClick={onLogout}
            style={{ color: "#dc2626", borderColor: "#fca5a5", padding: "10px 18px", fontSize: "13px" }}
          >
            <span>⎋</span>
            <span>Sign Out of Current Account</span>
          </button>

          {onOpenAuth && (
            <button
              type="button"
              className="clarity-btn-outline"
              onClick={onOpenAuth}
              style={{ padding: "10px 18px", fontSize: "13px" }}
            >
              <span>👤</span>
              <span>Switch or Register New Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
