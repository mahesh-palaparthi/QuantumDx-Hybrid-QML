import React from "react";

export default function ClarityHeader({ user, onOpenAuth }) {
  const getInitials = (name) => {
    if (!name) return "AM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.fullName || user?.email?.split("@")[0] || "Alex Morgan";

  return (
    <header className="clarity-header">
      <div className="clarity-header-title">
        QuantumDx · Intelligent Clinical Screening
      </div>

      <div className="clarity-header-actions">
        {/* Workspace badge */}
        <span className="clarity-workspace-pill">QUANTUMDX WORKSPACE</span>

        {/* Notification Bell */}
        <button
          type="button"
          className="clarity-bell-btn"
          title="System notifications"
        >
          <span style={{ fontSize: "15px" }}>🔔</span>
        </button>

        {/* User Profile avatar */}
        <div
          className="clarity-user-badge"
          onClick={onOpenAuth}
          title="Account profile"
        >
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
