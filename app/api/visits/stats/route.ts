const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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

function formatDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return new Response(JSON.stringify({ days: [], hours: [] }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  // 최근 7일(일별) + 최근 24시간(시간별)
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayKeys.push(`visits:day:${d.toDateString()}`);
  }
  const hourKeys: string[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const h = new Date(now.getTime() - i * 60 * 60 * 1000);
    const key = `visits:hour:${formatDay(h)}:${h.getHours()}`;
    hourKeys.push(key);
  }

  // mget 으로 조회(존재하지 않으면 0)
  const dayRes = await redis("mget", [dayKeys]);
  const hourRes = await redis("mget", [hourKeys]);
  const days = (dayRes?.result || []).map((v: any, idx: number) => ({
    key: dayKeys[idx],
    value: Number(v || 0),
  }));
  const hours = (hourRes?.result || []).map((v: any, idx: number) => ({
    key: hourKeys[idx],
    value: Number(v || 0),
  }));

  return new Response(JSON.stringify({ days, hours }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
