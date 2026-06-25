"use client";

import { Component, type ReactNode } from "react";

type ModelErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

/** Catches a failed model/asset load (or any other render-time throw) inside the 3D viewer so one broken asset shows a clear fallback instead of taking down the page. React error boundaries must be class components — there is no hook equivalent. */
export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("AssemblyShowcase failed to render:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
