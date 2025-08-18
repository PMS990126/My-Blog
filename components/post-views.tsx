"use client";

import { useEffect, useState } from "react";

export function PostViews({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await fetch(`/api/post-views?slug=${encodeURIComponent(slug)}`, {
          method: "POST",
          cache: "no-store",
        });
        const res = await fetch(`/api/post-views?slug=${encodeURIComponent(slug)}`, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as { views: number };
        if (!cancelled) setViews(data.views);
      } catch (e) {
        if (!cancelled) setError("-");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) return <span className="text-muted-foreground">조회수 {error}</span>;
  if (views === null) return <span className="text-muted-foreground">조회수 …</span>;
  return <span className="text-muted-foreground">조회수 {views.toLocaleString()}</span>;
}
