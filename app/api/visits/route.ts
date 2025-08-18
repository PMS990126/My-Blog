import { NextRequest, NextResponse } from "next/server";

// Upstash Redis 연동(환경변수 없을 때는 메모리 폴백)
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = {
  total: 0,
  today: 0,
  day: new Date().toDateString(),
};
const memoryUniqueByDay: Record<string, Set<string>> = {};

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

async function redisPath(command: string, ...args: (string | number)[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  const url = `${UPSTASH_URL}/${[command, ...args.map(String).map(encodeURIComponent)].join("/")}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
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
  const todayRes = await redisPath("get", todayKey);
  const totalRes = await redisPath("get", totalKey);
  const today = Number(todayRes?.result ?? 0);
  const total = Number(totalRes?.result ?? 0);
  return { total, today };
}

async function incrCountsIfUnique(visitorId: string) {
  const now = new Date();
  const todayLabel = now.toDateString();
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    if (!memoryUniqueByDay[todayLabel]) memoryUniqueByDay[todayLabel] = new Set<string>();
    const set = memoryUniqueByDay[todayLabel];
    if (!set.has(visitorId)) {
      set.add(visitorId);
      if (memory.day !== todayLabel) {
        memory.day = todayLabel;
        memory.today = 0;
      }
      memory.total += 1;
      memory.today += 1;
    }
    return { total: memory.total, today: memory.today };
  }
  const uniqueKey = `visits:unique:${todayLabel}`;
  const added = await redisPath("sadd", uniqueKey, visitorId);
  await redisPath("expire", uniqueKey, 60 * 60 * 24 * 3);
  if (Number(added?.result ?? 0) > 0) {
    const todayKey = `visits:day:${todayLabel}`;
    const totalKey = `visits:total`;
    const hourKey = `visits:hour:${now.toISOString().slice(0, 10)}:${now.getHours()}`;
    await redisPath("incr", todayKey);
    await redisPath("expire", todayKey, 60 * 60 * 24 * 2);
    await redisPath("incr", totalKey);
    await redisPath("incr", hourKey);
    await redisPath("expire", hourKey, 60 * 60 * 48);
  }
  return await getCounts();
}

export async function POST(req: NextRequest) {
  // 1인당 하루 1회만 카운트: cookie 기반 고유 ID 사용
  const existing = req.cookies.get("v_id")?.value;
  const id = existing || globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
  const counts = await incrCountsIfUnique(id);
  const res = NextResponse.json(counts, { headers: { "Cache-Control": "no-store" } });
  if (!existing) {
    res.cookies.set("v_id", id, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return res;
}

export async function GET() {
  const counts = await getCounts();
  return new Response(JSON.stringify(counts), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
