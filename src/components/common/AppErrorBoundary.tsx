"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches render errors so the app never whitescreens. */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[app-error]", error.message, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <h1 className="text-xl font-bold">문제가 발생했습니다</h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            잠시 후 다시 시도해주세요. 지도·일정 데이터는 브라우저에 남아 있을 수
            있습니다.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex h-10 items-center rounded-[var(--radius-md)] bg-[var(--color-ocean-600)] px-4 text-sm font-medium text-white"
          >
            홈으로 이동
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
