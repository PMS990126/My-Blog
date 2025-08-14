import { Metadata } from "next";
import { getAllPosts } from "@/lib/notion";
import { BlogPostCard } from "@/components/blog-post-card";
import { CategorySidebar } from "@/components/category-sidebar";
import { BlogHeader } from "@/components/blog-header";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { UserProfile } from "@/components/user-profile";

export const metadata: Metadata = {
  title: "PMS Dev Blog",
  description: "프론트엔드 개발자가 되기 위해 내가 학습한 기술과 경험을 기록하는 장소",
};

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const allPosts = await getAllPosts();
  const categories = Array.from(new Set(allPosts.map((post) => post.category)));
  const nowIso = new Date().toISOString();

  // 그룹 라벨 매핑(사이드바와 동일 기준)
  const mapToGroup = (rawCategory: string | undefined): string => {
    const name = (rawCategory || "").toLowerCase();
    const includesAny = (targets: string[]) => targets.some((t) => name.includes(t));

    if (includesAny(["html", "css", "sass", "scss", "tailwind"])) return "HTML / CSS";
    if (includesAny(["react", "next.js", "nextjs", "next"])) return "React / Next.js";
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

  // 카테고리 필터링
  const posts = category
    ? allPosts.filter((post) => mapToGroup(post.category) === category)
    : allPosts;

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <MobileSidebar
        categories={categories}
        posts={allPosts.map((p) => ({
          category: p.category,
          tags: p.tags,
          publishedAt: p.publishedAt,
        }))}
        nowIso={nowIso}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <CategorySidebar
              categories={categories}
              posts={allPosts.map((p) => ({
                category: p.category,
                tags: p.tags,
                publishedAt: p.publishedAt,
              }))}
              nowIso={nowIso}
            />
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            <div className="mb-8">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {category ? `${category} 포스트` : "최근 포스트"}
              </h1>
              <p className="text-muted-foreground">
                {category ? `${category} 카테고리` : "전체"} · {posts.length}개의 포스트
              </p>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} variant="list" />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {category
                    ? `${category} 카테고리에 포스트가 없습니다.`
                    : "아직 포스트가 없습니다."}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {category ? "다른 카테고리를 확인해보세요!" : "첫 번째 포스트를 작성해보세요!"}
                </p>
              </div>
            )}
          </main>

          {/* Right Sidebar - User Profile */}
          <aside className="hidden w-80 flex-shrink-0 xl:block">
            <UserProfile />
          </aside>
        </div>
      </div>
    </div>
  );
}
