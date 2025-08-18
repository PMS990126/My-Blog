import Link from "next/link";
import { Folder, Tag, Calendar, Hash } from "lucide-react";

interface CategorySidebarProps {
  categories: string[];
  posts: Array<{
    category: string;
    tags: string[];
    publishedAt: string;
  }>;
  nowIso?: string;
  currentCategory?: string | null;
}

export function CategorySidebar({
  categories,
  posts,
  nowIso,
  currentCategory,
}: CategorySidebarProps) {
  // 고정 노출 카테고리(요청 순서 유지)
  const PRESET_CATEGORIES: string[] = [
    "HTML / CSS",
    "JavaScript / TypeScript",
    "React / Next.js",
    "상태관리 / 데이터 캐싱",
    "API / 보안",
    "Build / Tooling",
    "최적화 / Refactoring",
    "Test / QA",
    "기타",
  ];

  // 원본 카테고리명을 그룹 레이블로 매핑
  const mapToGroup = (rawCategory: string | undefined): string => {
    const name = (rawCategory || "").toLowerCase();
    const includesAny = (targets: string[]) => targets.some((t) => name.includes(t));

    if (includesAny(["html", "css", "sass", "scss", "tailwind"])) return "HTML / CSS";
    // React / Next.js 를 먼저 판별하여 "next.js" 내의 "js"로 오분류되는 문제 방지
    if (includesAny(["react", "next.js", "nextjs", "next"])) return "React / Next.js";
    // 짧은 토큰("js", "ts")은 오탐이 많아 제외하고 풀네임만 사용
    if (includesAny(["javascript", "typescript"])) return "JavaScript / TypeScript";
    if (
      includesAny([
        "redux",
        "recoil",
        "zustand",
        "jotai",
        "state",
        "상태",
        "swr",
        "react-query",
        "tanstack",
        "query",
        "cache",
        "캐시",
      ])
    )
      return "상태관리 / 데이터 캐싱";
    if (
      includesAny([
        "api",
        "rest",
        "graphql",
        "gql",
        "axios",
        "fetch",
        "security",
        "auth",
        "인증",
        "보안",
        "oauth",
        "jwt",
        "csrf",
        "cors",
      ])
    )
      return "API / 보안";
    if (
      includesAny([
        "webpack",
        "vite",
        "rollup",
        "esbuild",
        "babel",
        "eslint",
        "prettier",
        "husky",
        "lint",
        "tool",
        "도구",
        "build",
        "빌드",
        "ci",
        "cd",
        "turbo",
        "nx",
      ])
    )
      return "Build / Tooling";
    if (
      includesAny([
        "optimiz",
        "최적화",
        "refactor",
        "리팩터",
        "performance",
        "성능",
        "memo",
        "lazy",
        "code split",
        "tree shaking",
      ])
    )
      return "최적화 / Refactoring";
    if (
      includesAny([
        "test",
        "jest",
        "vitest",
        "rtl",
        "react testing library",
        "cypress",
        "playwright",
        "qa",
        "e2e",
        "unit",
        "integration",
      ])
    )
      return "Test / QA";
    return "기타";
  };

  // 그룹별 포스트 수 계산
  const countByGroup = posts.reduce<Record<string, number>>((acc, post) => {
    const group = mapToGroup(post.category);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const getCategoryCount = (label: string): number => countByGroup[label] || 0;

  const totalPosts = posts.length;

  // 태그별 실제 빈도 기반 인기 태그 계산
  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    for (const tag of post.tags || []) {
      acc[tag] = (acc[tag] || 0) + 1;
    }
    return acc;
  }, {});

  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  // 최근 활동 통계
  const now = nowIso ? new Date(nowIso) : new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  // 주 시작(월요일 00:00) ~ 주 종료(일요일 23:59:59.999) 범위 계산
  const startOfWeek = (() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    // getDay(): 0(일)~6(토) => 월요일 시작을 위해 (day+6)%7 일수만큼 빼기
    const day = d.getDay();
    const diff = (day + 6) % 7; // 월=0, 화=1, ... 일=6
    d.setDate(d.getDate() - diff);
    return d.getTime();
  })();
  const endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000 - 1;

  const monthCount = posts.filter((p) => {
    const t = new Date(p.publishedAt).getTime();
    return t >= startOfMonth;
  }).length;
  const weekCount = posts.filter((p) => {
    const t = new Date(p.publishedAt).getTime();
    return t >= startOfWeek && t <= endOfWeek;
  }).length;

  return (
    <div className="space-y-6">
      {/* 카테고리 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-card-foreground">
          <Folder className="mr-2 h-5 w-5 text-primary" />
          카테고리
        </h3>
        <div className="space-y-2">
          <Link
            href="/"
            prefetch={false}
            className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
              !currentCategory
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            전체 ({totalPosts})
          </Link>
          {PRESET_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/?category=${encodeURIComponent(category)}`}
              prefetch={false}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                currentCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {category} ({getCategoryCount(category)})
            </Link>
          ))}
        </div>
      </div>

      {/* 인기 태그 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-card-foreground">
          <Tag className="mr-2 h-5 w-5 text-primary" />
          인기 태그
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/blog?search=${encodeURIComponent(tag.name)}`}
              prefetch={false}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Hash className="mr-1 h-3 w-3" />
              {tag.name}
              <span className="ml-1 text-xs opacity-70">({tag.count})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-card-foreground">
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          최근 활동
        </h3>
        <div className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground">이번 달</p>
            <p className="font-medium text-foreground">{monthCount}개의 새 포스트</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">이번 주</p>
            <p className="font-medium text-foreground">{weekCount}개의 새 포스트</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">총 포스트</p>
            <p className="font-medium text-foreground">{totalPosts}개</p>
          </div>
        </div>
      </div>
    </div>
  );
}
