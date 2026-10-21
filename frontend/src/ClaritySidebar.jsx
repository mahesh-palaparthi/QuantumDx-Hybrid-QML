import React from "react";

export default function ClaritySidebar({ activeTab, onSelectTab, onLogout, user }) {
  const navItems = [
    { key: "dashboard", label: "Home / Dashboard", icon: "⊞" },
    { key: "studio", label: "Disease Prediction", icon: "🩺" },
    { key: "history", label: "Prediction History", icon: "⏱️" },
    { key: "benchmarks", label: "Model Benchmarks", icon: "📈" },
    { key: "about", label: "About Us", icon: "ℹ️" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className="clarity-sidebar">
      <div>
        {/* Brand */}
        <div className="clarity-brand" onClick={() => onSelectTab("dashboard")}>
          <div className="clarity-brand-icon">
            <span>∿</span>
          </div>
          <div>
            <h1 className="clarity-brand-title">QuantumDx</h1>
            <div className="clarity-brand-sub">HYBRID QUANTUM AI</div>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="clarity-nav-list">
            {navItems.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    className={`clarity-nav-item ${isActive ? "active" : ""}`}
                    onClick={() => onSelectTab(item.key)}
                  >
                    <span className="clarity-nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom section */}
      <div>
        <div className="clarity-sidebar-callout">
          <div className="clarity-callout-title">Quantum precision. A clearer next step.</div>
          <div className="clarity-callout-desc">
            Use your screening to start a conversation with a clinician.
          </div>
        </div>

        <div className="clarity-sidebar-footer">
          <button
            type="button"
            className="clarity-logout-btn"
            onClick={onLogout}
          >
            <span>⎋</span>
            <span>{user ? "Sign Out" : "Sign In / Register"}</span>
          </button>
          <div className="clarity-sidebar-caption">
            QuantumDx · Clinical workspace
          </div>
        </div>
      </div>
    </aside>
  );
}
