import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./config";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState("signup"); // "signup" | "signin"
  const [step, setStep] = useState(1); // 1 | 2 (for signup)
  const [role, setRole] = useState("patient"); // "patient" | "researcher" | "doctor"

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [conditionalField, setConditionalField] = useState(""); // Institution or Designation
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("Female");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
 
  const handleClose = () => {
    setIsSuccess(false);
    setError("");
    setPassword("");
    setConfirmPassword("");
    setStep(1);
    setAuthMode("signin");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError("");
      setPassword("");
      setConfirmPassword("");
      setStep(1);
      setAuthMode("signin");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const roleHints = {
    patient: "You'll be able to run risk checks and track your own history.",
    researcher: "You'll get read access to de-identified prediction datasets and circuit benchmarks.",
    doctor: "You'll be able to review predictions and triage patients under your clinical care.",
  };

  const roleLabels = {
    researcher: "Research Institution / Lab",
    doctor: "Hospital / Clinical Specialty",
  };

  // Password Strength Evaluation
  const scorePassword = (val) => {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return Math.max(1, score);
  };

  const passScore = scorePassword(password);
  const strengthLabels = ["—", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#64748b", "#ff5f7e", "#f0b93a", "#4fd8ff", "#4fe0a0"];

  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Step 1 Validation
  const handleNextStep = () => {
    setError("");
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  // Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (passScore < 2) {
      setError("Please choose a stronger password (minimum 8 characters with letters/numbers).");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);
    try {
      const profile =
        role === "patient"
          ? { gender }
          : role === "researcher"
          ? { institution: conditionalField || "Quantum AI Institute", researchArea: "QML & Bioinformatics" }
          : { hospitalName: conditionalField || "Metro General Hospital", department: "Clinical Endocrinology" };

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
          role,
          profile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");

      localStorage.setItem("quantumdx_token", data.token);
      localStorage.setItem("quantumdx_user", JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign In Handler
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your username or email address and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed. Check your username/email or password.");

      localStorage.setItem("quantumdx_token", data.token);
      localStorage.setItem("quantumdx_user", JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Viva Demo Quick Access
  const handleDemoLogin = async (demoRole) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/demo/${demoRole}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Demo login failed.");

      localStorage.setItem("quantumdx_token", data.token);
      localStorage.setItem("quantumdx_user", JSON.stringify(data.user));
      onLoginSuccess(data.user, data.token);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qdx-modal-backdrop" onClick={handleClose}>
      <div className="qdx-auth-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="qdx-modal-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
          title="Close (Esc)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Banner at Top */}
        <div className="qdx-auth-brand-head">
          <div className="qdx-auth-brand-logo">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
              <path
                d="M16 27C10 22.6 3 17.4 3 10.9 3 6.9 6.1 4 9.8 4c2.3 0 4.4 1.2 5.7 3.1L16 8.4l.5-1.3C17.8 5.2 19.9 4 22.2 4 25.9 4 29 6.9 29 10.9 29 17.4 22 22.6 16 27Z"
                stroke="url(#gBrand)"
                strokeWidth="1.8"
              />
              <path
                d="M6 16h4l2 4 3-9 2 5h5"
                stroke="url(#gBrand)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gBrand" x1="3" y1="4" x2="29" y2="27">
                  <stop stopColor="#4fd8ff" />
                  <stop offset="1" stopColor="#b478ff" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <span className="qdx-auth-brand-title">Quantum<span>Dx</span></span>
              <span className="qdx-auth-brand-tag">DISEASE RISK PREDICTION PLATFORM</span>
            </div>
          </div>
          <div className="qdx-secure-pill-badge">
            <span className="qdx-secure-dot" /> System Secure
          </div>
        </div>

        {/* ==========================================================================
            SUCCESS STATE SCREEN
            ========================================================================== */}
        {isSuccess ? (
          <div className="qdx-auth-success-box">
            <div className="qdx-success-ring">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a0b16" strokeWidth="2.8">
                <path d="M5 13l4 4 10-10" />
              </svg>
            </div>
            <h2>Account Verified &amp; Ready!</h2>
            <p>
              Welcome to QuantumDx, <strong>{fullName}</strong>! Your {role.toUpperCase()} profile is securely stored with zero-cloud offline PBKDF2 encryption.
            </p>
            <button
              type="button"
              className="qdx-btn-primary-auth"
              style={{ width: "100%", marginTop: 16 }}
              onClick={handleClose}
            >
              Enter Screening Workspace ──&gt;
            </button>
          </div>
        ) : (
          <>
            {/* Mode Switcher Pills (Sign Up vs Sign In) */}
            <div className="qdx-auth-mode-toggle">
              <button
                type="button"
                className={`qdx-mode-btn ${authMode === "signup" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signup");
                  setStep(1);
                  setError("");
                }}
              >
                ✨ Create Account
              </button>
              <button
                type="button"
                className={`qdx-mode-btn ${authMode === "signin" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("signin");
                  setError("");
                }}
              >
                🔑 Sign In
              </button>
            </div>

            {/* Error Notification */}
            {error && <div className="qdx-auth-error-msg">⚠️ {error}</div>}

            {/* ==========================================================================
                MODE A: SIGN UP (2-STEP WIZARD MATCHING USER SPECIFICATION)
                ========================================================================== */}
            {authMode === "signup" && (
              <>
                {/* 2-Step Progress Indicator */}
                <div className="qdx-progress-wrap">
                  <div className="qdx-progress-label">
                    <span>
                      Step <b>{step}</b> of 2
                    </span>
                    <span>{step === 1 ? "Your details & role" : "Secure your account"}</span>
                  </div>
                  <div className="qdx-progress-track">
                    <div className="qdx-seg">
                      <i style={{ width: "100%" }} />
                    </div>
                    <div className="qdx-seg">
                      <i style={{ width: step === 2 ? "100%" : "0%" }} />
                    </div>
                  </div>
                </div>

                {/* STEP 1: Personal Details & Role Selection */}
                {step === 1 && (
                  <div className="qdx-step-container">
                    <div className="qdx-step-header">
                      <h2>Create your account</h2>
                      <p>Tell us who you are — the parameters adjust to fit your clinical role.</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="qdx-role-tabs-row">
                      <button
                        type="button"
                        className={`qdx-role-tab ${role === "patient" ? "active" : ""}`}
                        onClick={() => setRole("patient")}
                      >
                        👤 Patient
                      </button>
                      <button
                        type="button"
                        className={`qdx-role-tab ${role === "researcher" ? "active" : ""}`}
                        onClick={() => setRole("researcher")}
                      >
                        🎓 Researcher
                      </button>
                      <button
                        type="button"
                        className={`qdx-role-tab ${role === "doctor" ? "active" : ""}`}
                        onClick={() => setRole("doctor")}
                      >
                        🩺 Doctor
                      </button>
                    </div>
                    <div className="qdx-role-hint-text">{roleHints[role]}</div>

                    {/* Input Fields */}
                    <div className="qdx-field-group">
                      <label>
                        Full Name <span className="req">*</span>
                      </label>
                      <div className={`qdx-input-wrap ${fullName.trim().length > 1 ? "valid" : ""}`}>
                        <span className="qdx-input-icon">👤</span>
                        <input
                          type="text"
                          placeholder="e.g. Dr. Sarah Jenkins / Alex Mercer"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        {fullName.trim().length > 1 && <span className="qdx-status-check">✓</span>}
                      </div>
                    </div>

                    <div className="qdx-field-group">
                      <label>
                        Email Address <span className="req">*</span>
                      </label>
                      <div
                        className={`qdx-input-wrap ${
                          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "valid" : ""
                        }`}
                      >
                        <span className="qdx-input-icon">✉️</span>
                        <input
                          type="email"
                          placeholder="you@hospital.org or personal email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                          <span className="qdx-status-check">✓</span>
                        )}
                      </div>
                    </div>

                    <div className="qdx-field-row">
                      <div className="qdx-field-group" style={{ flex: 1 }}>
                        <label>Phone (Optional)</label>
                        <div className="qdx-input-wrap">
                          <span className="qdx-input-icon">📞</span>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      {role !== "patient" && (
                        <div className="qdx-field-group" style={{ flex: 1.2 }}>
                          <label>{roleLabels[role]}</label>
                          <div className="qdx-input-wrap">
                            <span className="qdx-input-icon">🏛️</span>
                            <input
                              type="text"
                              placeholder={
                                role === "researcher"
                                  ? "e.g. Stanford / AI Lab"
                                  : "e.g. Metro General / Cardiology"
                              }
                              value={conditionalField}
                              onChange={(e) => setConditionalField(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Continue Button */}
                    <button
                      type="button"
                      className="qdx-btn-primary-auth"
                      onClick={handleNextStep}
                      style={{ marginTop: 14 }}
                    >
                      Continue to Password ──&gt;
                    </button>

                    <div style={{ textAlign: "center", marginTop: 12, fontSize: "12px", color: "var(--qdx-text-muted)" }}>
                      Already have an account?{" "}
                      <button
                        type="button"
                        style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontWeight: 700, textDecoration: "underline", padding: 0 }}
                        onClick={() => {
                          setAuthMode("signin");
                          setError("");
                        }}
                      >
                        Sign In here
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Password & Security */}
                {step === 2 && (
                  <form onSubmit={handleRegisterSubmit} className="qdx-step-container">
                    <div className="qdx-step-header">
                      <h2>Secure your account</h2>
                      <p>Health data deserves robust protection. Choose a password you don't use elsewhere.</p>
                    </div>

                    {/* Password Field */}
                    <div className="qdx-field-group">
                      <label>
                        Password <span className="req">*</span>
                      </label>
                      <div className="qdx-input-wrap">
                        <span className="qdx-input-icon">🔒</span>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create strong password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="qdx-eye-btn"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {/* 4-Bar Password Strength Indicator */}
                      <div className="qdx-strength-meter">
                        <div className="qdx-strength-bars">
                          {[1, 2, 3, 4].map((barIndex) => (
                            <i
                              key={barIndex}
                              style={{
                                background:
                                  barIndex <= passScore
                                    ? strengthColors[passScore]
                                    : "rgba(150, 165, 220, 0.16)",
                              }}
                            />
                          ))}
                        </div>
                        <div className="qdx-strength-label">
                          Password strength:{" "}
                          <b style={{ color: strengthColors[passScore] }}>
                            {strengthLabels[passScore]}
                          </b>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="qdx-field-group">
                      <label>
                        Confirm Password <span className="req">*</span>
                      </label>
                      <div className="qdx-input-wrap">
                        <span className="qdx-input-icon">🔒</span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="qdx-eye-btn"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                          {showConfirmPassword ? "🙈" : "👁️"}
                        </button>
                      </div>

                      {/* Live Match Hint */}
                      {passwordsMatch && (
                        <div className="qdx-match-hint ok">
                          <span>✓ Passwords match</span>
                        </div>
                      )}
                      {passwordsMismatch && (
                        <div className="qdx-match-hint no">
                          <span>✕ Passwords don't match yet</span>
                        </div>
                      )}
                    </div>

                    {/* Gender Selection */}
                    <div className="qdx-field-group">
                      <label>Biological Gender (for clinical normalization)</label>
                      <div className="qdx-gender-toggle-row">
                        {[
                          { id: "Female", label: "Female", icon: "♀" },
                          { id: "Male", label: "Male", icon: "♂" },
                          { id: "Other", label: "Other / Non-Binary", icon: "⚧" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            className={`qdx-gender-btn ${gender === g.id ? "active" : ""}`}
                            onClick={() => setGender(g.id)}
                          >
                            <span className="qdx-gender-icon">{g.icon}</span>
                            <span className="qdx-gender-lbl">{g.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <label className="qdx-terms-row">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>
                        I agree to the <strong>Terms of Clinical Decision Support</strong> and{" "}
                        <strong>FIPS Offline Privacy Policy</strong>.
                      </span>
                    </label>

                    {/* Action Buttons */}
                    <div className="qdx-btn-row-auth">
                      <button
                        type="button"
                        className="qdx-btn-ghost-auth"
                        onClick={() => setStep(1)}
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        className="qdx-btn-primary-auth"
                        disabled={loading || !agreeTerms || !passwordsMatch || passScore < 2}
                      >
                        {loading ? "Creating Account..." : "Create Account ──>"}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* ==========================================================================
                MODE B: SIGN IN (EXISTING ACCOUNT)
                ========================================================================== */}
            {authMode === "signin" && (
              <form onSubmit={handleSignInSubmit} className="qdx-step-container">
                <div className="qdx-step-header">
                  <h2>Welcome Back</h2>
                  <p>Enter your credentials to access your persistent screening history and models.</p>
                </div>

                <div className="qdx-field-group">
                  <label>Username or Email Address</label>
                  <div className="qdx-input-wrap">
                    <span className="qdx-input-icon">👤</span>
                    <input
                      type="text"
                      placeholder="e.g. mahesh or you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="qdx-field-group">
                  <label>Password</label>
                  <div className="qdx-input-wrap">
                    <span className="qdx-input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="qdx-eye-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="qdx-btn-primary-auth"
                  disabled={loading}
                  style={{ marginTop: 10 }}
                >
                  {loading ? "Authenticating..." : "Sign In to QuantumDx ──>"}
                </button>

                <div style={{ textAlign: "center", marginTop: 12, fontSize: "12px", color: "var(--qdx-text-muted)" }}>
                  New to QuantumDx?{" "}
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#38bdf8", cursor: "pointer", fontWeight: 700, textDecoration: "underline", padding: 0 }}
                    onClick={() => {
                      setAuthMode("signup");
                      setStep(1);
                      setError("");
                    }}
                  >
                    Create an account
                  </button>
                </div>
              </form>
            )}

            {/* Divider & 1-Click Viva Demo Accounts */}
            <div className="qdx-auth-divider">
              <span>OR 1-CLICK VIVA EVALUATION ACCESS</span>
            </div>

            <div className="qdx-viva-demo-row">
              <button
                type="button"
                className="qdx-viva-btn doctor"
                onClick={() => handleDemoLogin("doctor")}
              >
                🩺 Log in as Doctor (Dr. Sarah)
              </button>
              <button
                type="button"
                className="qdx-viva-btn researcher"
                onClick={() => handleDemoLogin("researcher")}
              >
                🎓 Log in as Researcher (Prof. Alan)
              </button>
              <button
                type="button"
                className="qdx-viva-btn patient"
                onClick={() => handleDemoLogin("patient")}
              >
                👤 Log in as Patient (Alex)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
