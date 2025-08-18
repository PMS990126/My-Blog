"use client";

import { useEffect, useState } from "react";

interface Visits {
  total: number;
  today: number;
}

export function VisitsWidget() {
  const [visits, setVisits] = useState<Visits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [hours, setHours] = useState<Array<{ key: string; value: number }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setUpdating(true);
        await fetch("/api/visits?force=1", { method: "POST", cache: "no-store" });
        const res = await fetch("/api/visits", { method: "GET", cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as Visits;
        if (!cancelled) setVisits(data);
        // 통계 조회(시간별)
        const stats = await fetch("/api/visits/stats", { cache: "no-store" });
        if (stats.ok) {
          const j = await stats.json();
          if (!cancelled) setHours(j.hours ?? null);
        }
      } catch {
        if (!cancelled) setError("집계 오류");
      } finally {
        if (!cancelled) setUpdating(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-gradient-to-b from-card to-card/60 p-0 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
        <p className="text-sm font-semibold text-card-foreground">방문 통계</p>
        <span
          className={`h-2 w-2 rounded-full ${updating ? "animate-pulse bg-primary" : "bg-emerald-500"}`}
          aria-hidden
        />
      </div>
      <div className="grid grid-cols-2 gap-0">
        <div className="flex flex-col items-center justify-center gap-1 p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">오늘</span>
          {error ? (
            <span className="text-sm text-muted-foreground">오류</span>
          ) : visits ? (
            <span className="text-2xl font-bold text-foreground">{visits.today}</span>
          ) : (
            <span className="text-sm text-muted-foreground">…</span>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1 border-l border-border p-5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">누적</span>
          {error ? (
            <span className="text-sm text-muted-foreground">오류</span>
          ) : visits ? (
            <span className="text-2xl font-bold text-foreground">{visits.total}</span>
          ) : (
            <span className="text-sm text-muted-foreground">…</span>
          )}
        </div>
      </div>
      {/* Sparkline */}
      {hours && hours.length > 0 && (
        <div className="border-t border-border/60 px-4 py-3">
          <Sparkline data={hours.map((h: any) => h.value)} />
        </div>
      )}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(1, ...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 100;
    return `${x},${y}`;
  });
  const gradientId = "spark-gradient";
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="rgb(59 130 246)" strokeWidth="2" points={points.join(" ")} />
      <polygon fill={`url(#${gradientId})`} points={`0,100 ${points.join(" ")} 100,100`} />
    </svg>
  );
}
