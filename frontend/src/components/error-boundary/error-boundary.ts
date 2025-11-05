import React from "react";

type ErrorBoundaryProps = {
  fallback: (params: {
    error: Error;
    resetErrorBoundary: () => void;
  }) => React.ReactNode;
  onReset?: () => void;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
    this.props.onReset?.(); // chama o reset do TanStack
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      return fallback({
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      });
    }

    return children;
  }
}
