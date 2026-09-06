import { useEffect, useRef } from "react";

/**
 * QuantumBioCanvas
 * Full-viewport HTML5 Canvas animation behind the UI:
 * - Quantum / bio-radar aesthetic: drifting particle nodes, faint entanglement lines,
 *   subtle rotating bio-scan sweep, and concentric quantum probability waves.
 * - Performant: throttled to 60fps max, auto-pauses when browser tab is inactive (visibilitychange),
 *   and strictly enforces `pointer-events: none` so foreground UI is never blocked.
 */
export default function QuantumBioCanvas({ isPaused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isTabVisible = !document.hidden;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Particle nodes for quantum entanglement mesh
    const nodeCount = Math.min(48, Math.floor((width * height) / 28000));
    const particles = [];
    for (let i = 0; i < nodeCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        hue: Math.random() > 0.45 ? 190 : 275, // Cyan & Violet
      });
    }

    let radarAngle = 0;
    let waveRadius = 0;
    let lastTime = performance.now();
    const targetFpsInterval = 1000 / 60; // 60fps cap

    const render = (currentTime) => {
      animationFrameId = requestAnimationFrame(render);

      if (isPaused || !isTabVisible) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < targetFpsInterval) return;
      lastTime = currentTime - (elapsed % targetFpsInterval);

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle dark radial background
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        40,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.85
      );
      grad.addColorStop(0, "rgba(8, 20, 42, 0.45)");
      grad.addColorStop(0.5, "rgba(4, 11, 24, 0.25)");
      grad.addColorStop(1, "rgba(2, 5, 12, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Rotating Bio-Scanner Radar Line
      radarAngle += 0.0065;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.hypot(width, height) * 0.55;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(radarAngle);

      // Radar beam sweep
      const sweepGrad = ctx.createLinearGradient(0, 0, maxDist, 0);
      sweepGrad.addColorStop(0, "rgba(0, 210, 255, 0.22)");
      sweepGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.06)");
      sweepGrad.addColorStop(1, "rgba(0, 210, 255, 0)");

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxDist, 0, 0.22);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Scanner beam line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxDist, 0);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.22)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 3. Concentric Quantum Probability Waves
      waveRadius = (waveRadius + 0.75) % (Math.min(width, height) * 0.55);
      const waveAlpha = Math.max(0, 0.18 * (1 - waveRadius / (Math.min(width, height) * 0.55)));

      ctx.beginPath();
      ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168, 85, 247, ${waveAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, (waveRadius + 150) % (Math.min(width, height) * 0.55), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${waveAlpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 4. Update and Draw Quantum Entanglement Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Entanglement Lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Node drawing with pulse
        const pulse = (Math.sin(p.phase) + 1) * 0.5;
        const currentRadius = p.radius + pulse * 1.3;
        const glowAlpha = 0.35 + pulse * 0.45;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${glowAlpha})`;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 65%, 0.7)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}
