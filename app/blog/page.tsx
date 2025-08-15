import { Metadata } from "next";
import { BlogPostCard } from "@/components/blog-post-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchBar } from "@/components/search-bar";
import { getAllPosts } from "@/lib/notion";
import { CategorySidebar } from "@/components/category-sidebar";

import { MobileSidebar } from "@/components/mobile-sidebar";

export const metadata: Metadata = {
  title: "블로그 포스트",
  description: "개발 경험과 학습 내용을 공유하는 기술 블로그 포스트들입니다.",
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, search } = await searchParams;
  const posts = await getAllPosts();
  const nowIso = new Date().toISOString();

  // 그룹 라벨 매핑 함수 (사이드바와 동일 기준)
  const mapToGroup = (rawCategory: string | undefined): string => {
    const name = (rawCategory || "").toLowerCase();
    const includesAny = (targets: string[]) => targets.some((t) => name.includes(t));

    if (includesAny(["html", "css", "sass", "scss", "tailwind"])) return "HTML / CSS";
    // React / Next.js 를 먼저 평가하여 오분류 방지
    if (includesAny(["react", "next.js", "nextjs", "next"])) return "React / Next.js";
    // "js"/"ts" 단일 토큰 제외
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

  // 필터 카테고리(요청 순서)
  const FILTER_CATEGORIES = [
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

  // 카테고리 필터링
  const filteredPosts = category
    ? posts.filter((post) => mapToGroup(post.category) === category)
    : posts;

  // 검색 필터링 (제목/요약/태그/카테고리 + 동의어/약어/한글 대응)
  const normalize = (text: string) => (text || "").toLowerCase();

  const SYNONYMS: Record<string, string[]> = {
    // 언어/프레임워크
    javascript: ["js", "자바스크립트", "java script", "java-script"],
    js: ["javascript", "자바스크립트"],
    typescript: ["ts", "타입스크립트"],
    ts: ["typescript", "타입스크립트"],
    react: ["리액트"],
    "next.js": ["nextjs", "next", "넥스트", "넥스트js", "next js"],
    nextjs: ["next.js", "next", "넥스트", "넥스트js", "next js"],
    next: ["next.js", "nextjs", "넥스트", "넥스트js", "next js"],
    html: [],
    css: [],
    tailwind: ["tailwindcss", "테일윈드", "테일윈드css"],
    tailwindcss: ["tailwind", "테일윈드", "테일윈드css"],
    sass: ["scss"],
    scss: ["sass"],

    // 상태관리/데이터
    redux: [],
    recoil: [],
    zustand: [],
    jotai: [],
    state: ["상태", "상태관리"],
    상태관리: ["state"],
    "react-query": ["tanstack", "tanstack query", "query", "쿼리", "리액트쿼리", "리액트 쿼리"],
    tanstack: ["react-query", "query", "tanstack query"],
    query: ["react-query", "tanstack", "쿼리"],

    // API/보안
    api: ["rest", "graphql", "gql"],
    rest: ["api"],
    graphql: ["gql", "api"],
    gql: ["graphql", "api"],
    axios: [],
    fetch: [],
    security: ["보안"],
    auth: ["인증", "authentication", "authorize", "authorization", "oauth", "jwt"],
    인증: ["auth", "oauth", "jwt"],
    oauth: ["auth", "인증"],
    jwt: ["auth", "인증"],
    cors: [],
    csrf: [],

    // 빌드/도구
    webpack: [],
    vite: [],
    rollup: [],
    esbuild: [],
    babel: [],
    eslint: [],
    prettier: [],
    husky: [],
    lint: ["linter"],
    tool: ["도구"],
    build: ["빌드"],

    // 최적화/리팩토링
    최적화: ["optimization", "optimize", "performance", "성능"],
    optimization: ["최적화", "performance"],
    performance: ["성능", "최적화"],
    refactor: ["리팩터링", "리팩토링"],
    리팩터링: ["refactor", "리팩토링"],
    리팩토링: ["refactor", "리팩터링"],
    memo: ["메모", "메모화", "memoization", "usememo", "use memo"],
    lazy: ["레이지", "지연", "lazy loading", "지연 로딩"],
    "code split": ["codesplit", "code-splitting", "코드 분할", "코드 스플릿"],
    "tree shaking": ["treeshaking", "트리 쉐이킹", "트리셰이킹"],

    // 테스트/QA
    test: ["testing", "테스트", "테스팅", "qa", "e2e", "unit", "integration"],
    jest: ["test", "테스트"],
    vitest: ["test", "테스트"],
    rtl: ["react testing library", "react-testing-library"],
    cypress: ["e2e", "test", "테스트"],
    playwright: ["e2e", "test", "테스트"],
    qa: ["test", "테스트"],
    e2e: ["end to end", "test", "테스트"],
    unit: ["test", "테스트"],
    integration: ["test", "테스트"],
  };

  const tokenize = (q: string): string[] =>
    normalize(q)
      .split(/[^a-z0-9가-힣.+#/-]+/)
      .filter(Boolean);

  const expandToken = (t: string): string[] => {
    const candidates = new Set<string>([t]);
    const direct = SYNONYMS[t];
    if (direct) direct.forEach((v) => candidates.add(normalize(v)));
    // 간단한 파생형(공백/하이픈/점 제거 버전) 추가
    const compact = t.replace(/[.\s-]+/g, "");
    if (compact !== t) candidates.add(compact);
    return Array.from(candidates);
  };

  const searchedPosts = search
    ? filteredPosts.filter((post) => {
        const fields = [
          post.title,
          post.excerpt,
          post.category,
          mapToGroup(post.category),
          ...(post.tags || []),
        ].map((s) => normalize(s as string));

        const tokens = tokenize(search);
        for (const raw of tokens) {
          const variants = expandToken(raw);
          const matched = variants.some((v) => fields.some((f) => f.includes(v)));
          if (!matched) return false; // 모든 토큰을 만족하는 포스트만 남김(AND)
        }
        return true;
      })
    : filteredPosts;

  // 카테고리 목록(그룹 라벨 사용)
  const categories = FILTER_CATEGORIES;

  return (
    <div className="min-h-screen bg-background">
      <MobileSidebar
        categories={categories}
        posts={posts.map((p) => ({
          category: p.category,
          tags: p.tags,
          publishedAt: p.publishedAt,
        }))}
        nowIso={nowIso}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <CategorySidebar
              categories={categories}
              posts={posts.map((p) => ({
                category: p.category,
                tags: p.tags,
                publishedAt: p.publishedAt,
              }))}
              nowIso={nowIso}
            />
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold text-foreground">전체 포스트</h1>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <SearchBar />
              <CategoryFilter categories={categories} currentCategory={category} />
            </div>

            {/* Results Info */}
            <div className="mb-8">
              <p className="text-muted-foreground">{searchedPosts.length}개의 포스트</p>
            </div>

            {/* Posts Grid */}
            {searchedPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {searchedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">포스트를 찾을 수 없습니다.</p>
                {(category || search) && (
                  <p className="mt-2 text-muted-foreground">
                    다른 검색어나 카테고리를 시도해보세요.
                  </p>
                )}
              </div>
            )}
          </main>

          {/* Right Sidebar - User Profile (숨김) */}
        </div>
      </div>
    </div>
  );
}
