import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("QuantumDx Unhandled UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#F8FAFC",
            padding: "24px",
            fontFamily: "Inter, system-ui, sans-serif",
            color: "#1E293B",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              width: "100%",
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)",
              textAlign: "center",
              border: "1px solid #E2E8F0",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#FEF2F2",
                color: "#EF4444",
                fontSize: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              ⚠️
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 8px", color: "#0F172A" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "13.5px", color: "#64748B", margin: "0 0 24px", lineHeight: 1.5 }}>
              The workspace encountered an unexpected display issue. Your saved clinical records and prediction data are safe.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              style={{
                background: "#0D7C7A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(13, 124, 122, 0.25)",
              }}
            >
              Reload QuantumDx Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
