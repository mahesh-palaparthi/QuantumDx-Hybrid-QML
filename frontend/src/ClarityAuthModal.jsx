import React, { useState } from "react";
import { API_BASE_URL } from "./config";

export default function ClarityAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("alex.morgan@example.com");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.detail || "Authentication failed");
      }

      onAuthSuccess({
        token: data.token,
        user: data.user || { name: name || email.split("@")[0], email },
      });
      onClose();
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "880px",
          background: "#FFFFFF",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          position: "relative",
          border: "1px solid var(--c-card-border)",
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            fontSize: "20px",
            color: "var(--c-text-muted)",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Left Side: Navy Hero (Figma Matched) */}
        <div
          style={{
            background: "var(--c-navy)",
            padding: "40px 32px",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div className="clarity-brand-icon">∿</div>
              <span style={{ fontSize: "20px", fontWeight: 800 }}>clarity</span>
            </div>

            <div className="clarity-hero-tag" style={{ color: "#7DD3FC", marginBottom: 12 }}>
              A CLEARER START TO YOUR HEALTH
            </div>

            <h3 style={{ fontSize: "26px", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}>
              Better understanding.<br />More informed care.
            </h3>

            <p style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6, margin: "0 0 24px" }}>
              Explore early health screening with two approaches to machine learning, explained in language that makes sense.
            </p>

            {/* Mini Orbital */}
            <div style={{ position: "relative", width: 140, height: 100, margin: "0 auto 24px" }}>
              <div className="clarity-orbital-circle clarity-orbital-c1" style={{ width: 100, height: 100 }} />
              <div className="clarity-pulse-center" style={{ width: 36, height: 36, fontSize: 16 }}>
                ♥
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#7DD3FC" }}>🩺</span>
                <span style={{ fontSize: "12px", color: "#E2E8F0" }}>
                  <strong>Four focused pathways:</strong> Heart, Breast, Diabetes, and Child Nutrition.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#A7F3D0" }}>⚛️</span>
                <span style={{ fontSize: "12px", color: "#E2E8F0" }}>
                  <strong>Understand the &quot;why&quot;:</strong> Side-by-side Classical vs Quantum explanations.
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: 24 }}>
            Demo concept · Screening support, not a diagnosis.
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
              {isRegister ? "A clearer picture starts here." : "Welcome back."}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--c-text-muted)", margin: 0 }}>
              {isRegister
                ? "Create your account to explore guided health screenings."
                : "Log in to your health screening workspace."}
            </p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "8px 12px", borderRadius: 8, fontSize: "12px", marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isRegister && (
              <div className="clarity-field-group">
                <label className="clarity-field-label">Full name *</label>
                <input
                  type="text"
                  className="clarity-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                />
              </div>
            )}

            <div className="clarity-field-group">
              <label className="clarity-field-label">Email address *</label>
              <input
                type="email"
                className="clarity-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@example.com"
                required
              />
            </div>

            <div className="clarity-field-group">
              <label className="clarity-field-label">Password *</label>
              <div className="clarity-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="clarity-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "var(--c-text-muted)",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <span className="clarity-field-helper">Use the eye icon to show or hide password.</span>
            </div>

            {isRegister && (
              <div className="clarity-field-group">
                <label className="clarity-field-label">Confirm password *</label>
                <input
                  type="password"
                  className="clarity-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "var(--c-text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              {!isRegister && (
                <span style={{ color: "var(--c-teal)", fontWeight: 600, cursor: "pointer" }}>
                  Forgot password?
                </span>
              )}
            </div>

            <button
              type="submit"
              className="clarity-submit-btn"
              disabled={loading}
              style={{ marginTop: 6 }}
            >
              <span>{loading ? "Processing..." : isRegister ? "Create account →" : "Log in →"}</span>
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: "12.5px" }}>
            {isRegister ? (
              <span style={{ color: "var(--c-text-muted)" }}>
                Already have an account?{" "}
                <strong
                  style={{ color: "var(--c-teal)", cursor: "pointer" }}
                  onClick={() => setIsRegister(false)}
                >
                  Log in
                </strong>
              </span>
            ) : (
              <span style={{ color: "var(--c-text-muted)" }}>
                New to Clarity Health?{" "}
                <strong
                  style={{ color: "var(--c-teal)", cursor: "pointer" }}
                  onClick={() => setIsRegister(true)}
                >
                  Create an account
                </strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
