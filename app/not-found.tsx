"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-8">
          <h1 className="mb-4 text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="mb-4 text-3xl font-bold text-foreground">페이지를 찾을 수 없습니다</h2>
          <p className="mb-8 text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
