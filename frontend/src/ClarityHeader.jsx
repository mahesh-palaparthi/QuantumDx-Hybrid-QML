import React from "react";

export default function ClarityHeader({ user, onOpenAuth }) {
  const getInitials = (name) => {
    if (!name) return "JD";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user ? (user.fullName || user.name || user.email?.split("@")[0] || "User") : null;

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

        {/* User Profile / Auth Action */}
        {user ? (
          <div
            className="clarity-user-badge"
            onClick={onOpenAuth}
            title="Account profile and session"
          >
            <div className="clarity-user-avatar">
              {getInitials(displayName)}
            </div>
            <span className="clarity-user-name">
              {displayName}
            </span>
          </div>
        ) : (
          <button
            type="button"
            className="clarity-btn-primary"
            onClick={onOpenAuth}
            style={{ padding: "8px 16px", fontSize: "12.5px" }}
          >
            <span>👤</span>
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
}
