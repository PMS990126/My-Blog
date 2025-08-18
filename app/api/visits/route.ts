import { NextRequest } from "next/server";

// Upstash Redis 연동(환경변수 없을 때는 메모리 폴백)
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let memory = {
  total: 0,
  today: 0,
  day: new Date().toDateString(),
};

async function redisFetch(path: string, body: any[]) {
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

function isBotOrPrefetch(req: Request): boolean {
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

async function getCounts() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    const today = new Date().toDateString();
    if (memory.day !== today) {
      memory.day = today;
      memory.today = 0;
    }
    return { total: memory.total, today: memory.today };
  }

  const todayKey = `visits:day:${new Date().toDateString()}`;
  const totalKey = `visits:total`;
  const getToday = await redisFetch("mget", [[todayKey]]);
  const getTotal = await redisFetch("mget", [[totalKey]]);
  const today = Number(getToday?.result?.[0] || 0);
  const total = Number(getTotal?.result?.[0] || 0);
  return { total, today };
}

async function incrCounts() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    const today = new Date().toDateString();
    if (memory.day !== today) {
      memory.day = today;
      memory.today = 0;
    }
    memory.total += 1;
    memory.today += 1;
    return { total: memory.total, today: memory.today };
  }
  const now = new Date();
  const todayKey = `visits:day:${now.toDateString()}`;
  const totalKey = `visits:total`;
  const hourKey = `visits:hour:${now.toISOString().slice(0, 10)}:${now.getHours()}`;
  await redisFetch("pipeline", [
    [
      ["INCR", todayKey],
      ["EXPIRE", todayKey, 60 * 60 * 24 * 2],
      ["INCR", totalKey],
      ["INCR", hourKey],
      ["EXPIRE", hourKey, 60 * 60 * 48],
    ],
  ]);
  return await getCounts();
}

export async function POST(req: NextRequest) {
  if (isBotOrPrefetch(req)) {
    const counts = await getCounts();
    return new Response(JSON.stringify({ ...counts, ignored: true }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  const counts = await incrCounts();
  return new Response(JSON.stringify(counts), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export async function GET() {
  const counts = await getCounts();
  return new Response(JSON.stringify(counts), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
