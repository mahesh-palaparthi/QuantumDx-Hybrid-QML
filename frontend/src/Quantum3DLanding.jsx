import React, { useEffect, useRef, useState } from "react";

export default function Quantum3DLanding({ onLaunchPrediction, onOpenAuth, onOpenStudio }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  // 3D Quantum Bloch Sphere & Bio-Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 460);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = Math.min(500, Math.max(380, window.innerHeight * 0.45));
      }
    };
    window.addEventListener("resize", handleResize);

    // Particle field & Qubit state vectors
    let angleX = 0.3;
    let angleY = 0;
    const particles = [];
    for (let i = 0; i < 48; i++) {
      particles.push({
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(Math.random() * 2 - 1),
        radius: 120 + (Math.random() - 0.5) * 20,
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 1.2,
        color: i % 3 === 0 ? "#00d2ff" : i % 3 === 1 ? "#c084fc" : "#38bdf8",
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.32;

      // Gentle interactive rotation influenced by mouse
      angleY += 0.008;
      const targetAngleX = 0.3 + mousePos.y * 0.4;
      const targetAngleY = angleY + mousePos.x * 0.6;

      // 1. Draw 3D Bloch Sphere Latitude & Longitude Wireframes
      ctx.save();
      ctx.lineWidth = 1.2;

      // Glowing Outer Aura
      const auraGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.4, cx, cy, baseRadius * 1.3);
      auraGrad.addColorStop(0, "rgba(6, 182, 212, 0.18)");
      auraGrad.addColorStop(0.6, "rgba(147, 51, 234, 0.10)");
      auraGrad.addColorStop(1, "transparent");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Latitude Rings (Horizontal Circles in 3D)
      const lats = [-0.6, -0.3, 0, 0.3, 0.6];
      lats.forEach((latFactor) => {
        const ringY = cy + latFactor * baseRadius * Math.cos(targetAngleX);
        const ringRx = baseRadius * Math.sqrt(Math.max(0, 1 - latFactor * latFactor));
        const ringRy = ringRx * Math.sin(targetAngleX) * 0.6;

        ctx.strokeStyle = latFactor === 0 ? "rgba(56, 189, 248, 0.45)" : "rgba(56, 189, 248, 0.16)";
        ctx.beginPath();
        ctx.ellipse(cx, ringY, ringRx, Math.abs(ringRy) + 1, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Longitude Rings (Vertical Rotating Ellipses)
      for (let i = 0; i < 4; i++) {
        const lonAngle = targetAngleY + (i * Math.PI) / 4;
        const tiltWidth = baseRadius * Math.cos(lonAngle);
        ctx.strokeStyle = i === 0 ? "rgba(192, 132, 252, 0.45)" : "rgba(168, 85, 247, 0.16)";
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(tiltWidth), baseRadius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 2. Central Z-Axis Vector (|0⟩ North, |1⟩ South)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy - baseRadius - 16);
      ctx.lineTo(cx, cy + baseRadius + 16);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pole labels |0⟩ and |1⟩
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("|0⟩ Classical Ground", cx, cy - baseRadius - 22);
      ctx.fillStyle = "#c084fc";
      ctx.fillText("|1⟩ Quantum Excited", cx, cy + baseRadius + 28);

      // 3. Dynamic State Vector |ψ⟩ (Rotating State)
      const psiTheta = Math.sin(time * 0.7) * 0.8 + Math.PI / 3;
      const psiPhi = targetAngleY * 1.5;
      const vx = cx + baseRadius * Math.sin(psiTheta) * Math.sin(psiPhi);
      const vy = cy - baseRadius * Math.cos(psiTheta);

      // Vector Line
      const vecGrad = ctx.createLinearGradient(cx, cy, vx, vy);
      vecGrad.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      vecGrad.addColorStop(1, "#00d2ff");
      ctx.strokeStyle = vecGrad;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(vx, vy);
      ctx.stroke();

      // State tip glow
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#00d2ff";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(vx, vy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label state |ψ⟩
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText("|ψ(θ, φ)⟩", vx + 14, vy - 6);

      // 4. Orbiting Quantum Particles / Qubits
      particles.forEach((p) => {
        p.theta += p.speed;
        const x3d = p.radius * Math.sin(p.phi) * Math.cos(p.theta);
        const y3d = p.radius * Math.sin(p.phi) * Math.sin(p.theta);
        const z3d = p.radius * Math.cos(p.phi);

        // Simple 3D projection
        const cosY = Math.cos(targetAngleY);
        const sinY = Math.sin(targetAngleY);
        const rotX = x3d * cosY - z3d * sinY;
        const rotZ = x3d * sinY + z3d * cosY;

        const scale = (rotZ + 200) / 200;
        const px = cx + rotX;
        const py = cy + y3d * scale;

        if (scale > 0.3) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(px, py, Math.max(1, p.size * scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Central Glowing Shield Icon at Core
      ctx.fillStyle = "rgba(6, 182, 212, 0.85)";
      ctx.shadowColor = "#00d2ff";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#071021";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚛️", cx, cy);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePos]);

  return (
    <div className="qdx-3d-landing-container">
      {/* Hero Section with Interactive 3D Canvas */}
      <section className="qdx-landing-hero">
        <div className="qdx-landing-hero-left">
          <div className="qdx-badge-eyebrow">
            <span className="qdx-pulse-dot-cyan" />
            Hybrid Quantum-Classical Clinical Decision Intelligence
          </div>

          <h1 className="qdx-landing-title">
            Early Disease Detection <br />
            <span className="qdx-gradient-text-landing">Powered by Quantum ML</span>
          </h1>

          <p className="qdx-landing-subtitle">
            Harnessing 4-qubit Hilbert space parameter-shift rotations with Tuned Classical SVM hyperplanes. Detect diabetes, cardiovascular strain, and cellular anomalies at earlier, more treatable stages.
          </p>

          {/* Call to Action Buttons */}
          <div className="qdx-landing-cta-row">
            <button
              type="button"
              className="qdx-btn-landing-primary"
              onClick={onLaunchPrediction}
            >
              🚀 Launch Screening Studio ──&gt;
            </button>
            <button
              type="button"
              className="qdx-btn-landing-secondary"
              onClick={onOpenAuth}
            >
              🔐 Create Free Account / Sign In
            </button>
            <button
              type="button"
              className="qdx-btn-landing-ghost"
              onClick={onOpenStudio}
            >
              ⚖️ Judge Studio Benchmarks
            </button>
          </div>

          {/* Trust & Compliance Micro-Badges */}
          <div className="qdx-landing-trust-strip">
            <div className="qdx-trust-item">
              <span className="qdx-trust-icon">🛡️</span>
              <span>100% Offline PBKDF2 Privacy</span>
            </div>
            <div className="qdx-trust-item">
              <span className="qdx-trust-icon">⚛️</span>
              <span>PennyLane Quantum Circuit</span>
            </div>
            <div className="qdx-trust-item">
              <span className="qdx-trust-icon">📊</span>
              <span>Real-Time XAI Attribution</span>
            </div>
          </div>
        </div>

        {/* 3D Interactive Canvas Column */}
        <div
          className="qdx-landing-hero-right"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePos({
              x: (e.clientX - rect.left) / rect.width - 0.5,
              y: (e.clientY - rect.top) / rect.height - 0.5,
            });
          }}
        >
          <div className="qdx-canvas-glass-card">
            <div className="qdx-canvas-badge">
              <span>● Interactive 3D Quantum Bloch Sphere (Hover to Orbit)</span>
            </div>
            <canvas ref={canvasRef} className="qdx-3d-canvas" />
            <div className="qdx-canvas-caption">
              <span>State Vector: |ψ(θ,φ)⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Model Metrics Bar (With Exact Percentages) */}
      <section className="qdx-metrics-banner">
        <div className="qdx-metrics-banner-title">
          <span>🏆 CLINICAL BENCHMARK AUDIT (5-FOLD CROSS-VALIDATION)</span>
        </div>

        <div className="qdx-metrics-strip-grid">
          <div className="qdx-metric-strip-card">
            <div className="qdx-metric-strip-top">
              <span className="qdx-strip-tag classical">Classical Engine</span>
              <span className="qdx-strip-val">94.00%</span>
            </div>
            <strong className="qdx-strip-name">Tuned SVM (RBF Kernel)</strong>
            <p className="qdx-strip-desc">
              Sensitivity (Recall): <strong>98.57%</strong> | ROC-AUC: <strong>98.35%</strong> | Precision: <strong>93.22%</strong>
            </p>
          </div>

          <div className="qdx-metric-strip-card">
            <div className="qdx-metric-strip-top">
              <span className="qdx-strip-tag quantum">Quantum Engine</span>
              <span className="qdx-strip-val">88.50%</span>
            </div>
            <strong className="qdx-strip-name">Quantum Kernel SVM (QSVM)</strong>
            <p className="qdx-strip-desc">
              4-Qubit Fidelity Kernel | Recall: <strong>93.52%</strong> | ROC-AUC: <strong>94.57%</strong>
            </p>
          </div>

          <div className="qdx-metric-strip-card">
            <div className="qdx-metric-strip-top">
              <span className="qdx-strip-tag qnn">Real-Time Circuit</span>
              <span className="qdx-strip-val">&lt; 185 ms</span>
            </div>
            <strong className="qdx-strip-name">Hybrid Quantum Neural Net (QNN)</strong>
            <p className="qdx-strip-desc">
              Accuracy: <strong>81.30%</strong> | ROC-AUC: <strong>91.43%</strong> | 29 Quantum Euler Parameters
            </p>
          </div>

          <div className="qdx-metric-strip-card">
            <div className="qdx-metric-strip-top">
              <span className="qdx-strip-tag safe">Safety Protocol</span>
              <span className="qdx-strip-val">100% Gated</span>
            </div>
            <strong className="qdx-strip-name">Dual Consensus Protocol</strong>
            <p className="qdx-strip-desc">
              Discordance Gap Δ &lt; 0.45 safety threshold prevents binary diagnostic clearance on edge cases.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Architecture Pillars */}
      <section className="qdx-pillars-section">
        <div className="qdx-section-heading-wrap">
          <span className="qdx-badge-eyebrow">Hybrid Advantage</span>
          <h2 className="qdx-section-title">How QuantumDx Elevates Clinical Decision Support</h2>
          <p className="qdx-section-subtitle">
            Classical neural networks excel at bulk linear processing. Quantum circuits map high-dimensional non-linear Hilbert spaces. Together, they achieve unparalleled early diagnostic sensitivity.
          </p>
        </div>

        <div className="qdx-pillars-grid">
          {/* Pillar 1 */}
          <div className="qdx-pillar-card">
            <div className="qdx-pillar-icon-box cyan">
              <span>⚛️</span>
            </div>
            <h3 className="qdx-pillar-title">1. Quantum Hilbert Feature Mapping</h3>
            <p className="qdx-pillar-text">
              16 clinical symptoms are scaled and encoded as quantum rotation angles onto 4 entangled qubits. Strong parameter-shift circuits discover subtle metabolic inter-dependencies that classical models frequently miss.
            </p>
            <ul className="qdx-pillar-list">
              <li>✓ PennyLane 4-Qubit simulator</li>
              <li>✓ Euler angle rotations ($R_y, R_z$)</li>
              <li>✓ Multi-qubit CNOT entanglement</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="qdx-pillar-card">
            <div className="qdx-pillar-icon-box purple">
              <span>🛡️</span>
            </div>
            <h3 className="qdx-pillar-title">2. Dual Consensus &amp; Safety Gating</h3>
            <p className="qdx-pillar-text">
              Instead of relying on a single 'black-box' model, predictions are evaluated by both Classical Tuned SVM and Quantum QNN. If models diverge (Discordance Gap $\Delta \ge 0.45$), an automatic safety escalation flag is triggered.
            </p>
            <ul className="qdx-pillar-list">
              <li>✓ Harmonic mean weighted risk ($H$)</li>
              <li>✓ 40%–60% uncertainty margin escalation</li>
              <li>✓ Zero false reassurance for borderline patients</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="qdx-pillar-card">
            <div className="qdx-pillar-icon-box green">
              <span>💡</span>
            </div>
            <h3 className="qdx-pillar-title">3. Explainable AI &amp; Patient Access</h3>
            <p className="qdx-pillar-text">
              Demystifying the diagnostic decision. Medical jargon is translated into everyday words (e.g. Polyuria $\rightarrow$ Frequent Urination) with color-coded attribution bars so patients and doctors immediately understand why the prediction was made.
            </p>
            <ul className="qdx-pillar-list">
              <li>✓ Dynamic feature contribution percentages</li>
              <li>✓ SHAP permutation attribution</li>
              <li>✓ Plain-language everyday symptom guides</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Patient & Illiterate-Friendly Workflow Showcase */}
      <section className="qdx-workflow-showcase">
        <div className="qdx-workflow-card">
          <div className="qdx-workflow-header">
            <div>
              <span className="qdx-badge-eyebrow">Accessibility First</span>
              <h2 className="qdx-workflow-title">Designed for Everyday Patients and Clinicians</h2>
              <p className="qdx-workflow-subtitle">
                Medical terminology shouldn't be an obstacle to your health. Every clinical indicator in QuantumDx includes plain-language descriptions and visual cues.
              </p>
            </div>
            <button
              type="button"
              className="qdx-btn-landing-primary"
              onClick={onLaunchPrediction}
            >
              Start Free Screening Now ──&gt;
            </button>
          </div>

          <div className="qdx-plain-words-grid">
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">💧</span>
              <div className="qdx-plain-info">
                <strong>Polyuria</strong>
                <span className="qdx-plain-trans">Frequent Urination (Peeing very often, waking up at night)</span>
              </div>
            </div>
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">🥤</span>
              <div className="qdx-plain-info">
                <strong>Polydipsia</strong>
                <span className="qdx-plain-trans">Constant Thirst (Dry mouth, drinking water non-stop)</span>
              </div>
            </div>
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">⚖️</span>
              <div className="qdx-plain-info">
                <strong>Sudden Weight Loss</strong>
                <span className="qdx-plain-trans">Losing weight quickly without dieting or trying</span>
              </div>
            </div>
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">🍽️</span>
              <div className="qdx-plain-info">
                <strong>Polyphagia</strong>
                <span className="qdx-plain-trans">Constant Hunger (Feeling starved right after full meals)</span>
              </div>
            </div>
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">👁️</span>
              <div className="qdx-plain-info">
                <strong>Visual Blurring</strong>
                <span className="qdx-plain-trans">Blurred Vision (Fuzzy eyesight, trouble reading)</span>
              </div>
            </div>
            <div className="qdx-plain-box">
              <span className="qdx-plain-icon">🩹</span>
              <div className="qdx-plain-info">
                <strong>Delayed Healing</strong>
                <span className="qdx-plain-trans">Slow Healing Wounds (Cuts and sores taking weeks to close)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
