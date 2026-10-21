import React from "react";

export default function ClarityHeader({
  uiMode,
  setUiMode,
  user,
  onOpenAuth,
}) {
  const getInitials = (name) => {
    if (!name) return "AM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Alex Morgan";

  return (
    <header className="clarity-header">
      <div className="clarity-header-title">
        Your health, with clarity
      </div>

      <div className="clarity-header-actions">
        {/* Dual-Mode UI Switcher */}
        <div className="clarity-mode-toggle" title="Switch between new Clarity Figma design and the original Classic Studio">
          <button
            type="button"
            className={`clarity-toggle-btn ${uiMode === "clarity" ? "active" : ""}`}
            onClick={() => setUiMode("clarity")}
          >
            ✨ Clarity UI
          </button>
          <button
            type="button"
            className={`clarity-toggle-btn ${uiMode === "classic" ? "active" : ""}`}
            onClick={() => setUiMode("classic")}
          >
            🏛️ Classic Studio
          </button>
        </div>

        {/* Demo Workspace badge */}
        <span className="clarity-workspace-pill">DEMO WORKSPACE</span>

        {/* Notification Bell */}
        <button
          type="button"
          className="clarity-bell-btn"
          title="System notifications"
          onClick={() => {}}
        >
          🔔
        </button>

        {/* User Badge */}
        <div className="clarity-user-badge" onClick={onOpenAuth}>
          <div className="clarity-user-avatar">
            {getInitials(displayName)}
          </div>
          <span className="clarity-user-name">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  );
}
