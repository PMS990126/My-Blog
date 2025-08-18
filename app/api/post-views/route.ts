import { NextRequest } from "next/server";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type Memory = Record<string, number>;
const memory: Memory = {};

function isBotOrPrefetch(req: NextRequest): boolean {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const purpose = (
    req.headers.get("purpose") ||
    req.headers.get("sec-purpose") ||
    ""
  ).toLowerCase();
  const fetchMode = (req.headers.get("sec-fetch-mode") || "").toLowerCase();
  const botTokens = [
    "bot",
    "spider",
    "crawl",
    "headless",
    "node-fetch",
    "curl",
    "wget",
    "monitor",
    "uptime",
    "lighthouse",
    "vercel",
    "render",
  ];
  if (purpose.includes("prefetch") || purpose.includes("prerender")) return true;
  if (fetchMode.includes("prefetch")) return true;
  return botTokens.some((t) => ua.includes(t));
}

async function redis(path: string, body: any[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const res = await fetch(`${UPSTASH_URL}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { result: any };
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return new Response(JSON.stringify({ error: "slug required" }), { status: 400 });

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    memory[slug] = (memory[slug] || 0) + 1;
    return new Response(JSON.stringify({ views: memory[slug] || 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  const key = `post:views:${slug}`;
  await redis("pipeline", [[["INCR", key]]]);
  const res = await redis("mget", [[key]]);
  const views = Number(res?.result?.[0] || 0);
  return new Response(JSON.stringify({ views }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return new Response(JSON.stringify({ error: "slug required" }), { status: 400 });
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return new Response(JSON.stringify({ views: memory[slug] || 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  const key = `post:views:${slug}`;
  const res = await redis("mget", [[key]]);
  const views = Number(res?.result?.[0] || 0);
  return new Response(JSON.stringify({ views }), {
    headers: { "Content-Type": "application/json" },
  });
}
