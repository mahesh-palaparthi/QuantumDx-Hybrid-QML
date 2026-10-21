import React, { useState } from "react";
import { API_BASE_URL } from "./config";

export default function ClarityAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegister) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setError("Please enter your email and password.");
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { fullName: name.trim(), name: name.trim(), email: email.trim(), password }
        : { identifier: email.trim(), email: email.trim(), password };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.detail || "Authentication failed");
      }

      const authenticatedUser = data.user || {
        fullName: isRegister ? name.trim() : email.split("@")[0],
        name: isRegister ? name.trim() : email.split("@")[0],
        email: email.trim(),
        role: "patient",
      };

      setSuccess(
        isRegister
          ? `✓ Account created successfully! Logging you in as ${authenticatedUser.fullName}...`
          : `✓ Welcome back, ${authenticatedUser.fullName || authenticatedUser.name}!`
      );

      setTimeout(() => {
        onAuthSuccess({
          token: data.token || "session_token_granted",
          user: authenticatedUser,
        });
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message || "An error occurred. Please verify your credentials and try again.");
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
          maxWidth: "840px",
          background: "#FFFFFF",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "grid",
          gridTemplateColumns: "1fr 1.1fr",
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

        {/* Left Side: Navy Hero */}
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
              <span style={{ fontSize: "20px", fontWeight: 800 }}>QuantumDx</span>
            </div>

            <div className="clarity-hero-tag" style={{ color: "#7DD3FC", marginBottom: 12 }}>
              A CLEARER START TO YOUR HEALTH
            </div>

            <h3 style={{ fontSize: "25px", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25 }}>
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
                  <strong>Four clinical pathways:</strong> Diabetes, Malnutrition, Heart, and Cancer.
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "#A7F3D0" }}>⚛️</span>
                <span style={{ fontSize: "12px", color: "#E2E8F0" }}>
                  <strong>Dual intelligence:</strong> Classical ML &amp; Quantum Hilbert Space verification.
                </span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "11px", color: "#64748B", marginTop: 24 }}>
            QuantumDx Clinical AI · Medical screening assistance tool.
          </div>
        </div>

        {/* Right Side: Clean Form */}
        <div style={{ padding: "36px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: "flex",
              background: "#F1F5F9",
              borderRadius: "10px",
              padding: "4px",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: !isRegister ? "#FFFFFF" : "transparent",
                color: !isRegister ? "var(--c-teal)" : "var(--c-text-muted)",
                fontWeight: !isRegister ? 700 : 500,
                boxShadow: !isRegister ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontSize: "13px",
              }}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
                setSuccess("");
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: isRegister ? "#FFFFFF" : "transparent",
                color: isRegister ? "var(--c-teal)" : "var(--c-text-muted)",
                fontWeight: isRegister ? 700 : 500,
                boxShadow: isRegister ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontSize: "13px",
              }}
            >
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: 18 }}>
            <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px", color: "var(--c-text-primary)" }}>
              {isRegister ? "Create your account" : "Welcome back"}
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--c-text-muted)", margin: 0 }}>
              {isRegister
                ? "Enter your details to create a personal screening profile."
                : "Log in with your email and password to access your workspace."}
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#991B1B",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: "12px",
                marginBottom: 16,
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#ECFDF5",
                border: "1px solid #A7F3D0",
                color: "#065F46",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: "12px",
                marginBottom: 16,
                lineHeight: 1.4,
                fontWeight: 600,
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {isRegister && (
              <div className="clarity-field-group">
                <label className="clarity-field-label">Full Name *</label>
                <input
                  type="text"
                  className="clarity-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  autoFocus
                />
              </div>
            )}

            <div className="clarity-field-group">
              <label className="clarity-field-label">Email Address *</label>
              <input
                type="email"
                className="clarity-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus={!isRegister}
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
                  placeholder={isRegister ? "Minimum 6 characters" : "••••••••••••"}
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
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="clarity-field-group">
                <label className="clarity-field-label">Confirm Password *</label>
                <input
                  type="password"
                  className="clarity-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                <span
                  style={{ color: "var(--c-teal)", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => {
                    alert("To reset your password, please contact your workspace administrator or register a new account.");
                  }}
                >
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
              <span>{loading ? "Processing..." : isRegister ? "Create Account →" : "Log In →"}</span>
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 18, fontSize: "12.5px" }}>
            {isRegister ? (
              <span style={{ color: "var(--c-text-muted)" }}>
                Already have an account?{" "}
                <strong
                  style={{ color: "var(--c-teal)", cursor: "pointer" }}
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Log in
                </strong>
              </span>
            ) : (
              <span style={{ color: "var(--c-text-muted)" }}>
                Don't have an account?{" "}
                <strong
                  style={{ color: "var(--c-teal)", cursor: "pointer" }}
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setSuccess("");
                  }}
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
