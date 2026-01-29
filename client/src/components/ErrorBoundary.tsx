import React, { type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "24px", textAlign: "center", color: "#ff0000" }}>
          <h2>Oops! Something went wrong</h2>
          <p>
            {this.state.error?.message ||
              "An unexpected error occurred. Please refresh the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              marginTop: "16px",
              cursor: "pointer",
              backgroundColor: "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
