import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { cache } from "react";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const n2m = new NotionToMarkdown({ notionClient: notion });

const databaseId = process.env.NOTION_DATABASE_ID!;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  status: "published" | "draft";
  coverImage?: string;
  readTime?: number;
}

export interface DatabaseQueryResult {
  id: string;
  properties: {
    [key: string]: any;
  };
  created_time: string;
  last_edited_time: string;
  cover?: {
    type: string;
    [key: string]: any;
  };
}

// 캐시된 함수들
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    // Notion 쿼리 단계에서의 정렬/상태 필터 의존성을 제거하여 스키마 차이로 인한 오류를 회피
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        // 전체 데이터(본문 포함) 변환
        return await convertNotionPageToBlogPost(page, true);
      })
    );

    // 게시 상태 필터링(대소문자 무시) 및 발행일 기준 최신순 정렬
    const publishedPosts = (posts.filter(Boolean) as BlogPost[]).filter(
      (post) => post.status && post.status.toLowerCase() === "published"
    );

    publishedPosts.sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

    return publishedPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
});

// 목록/사이드바/연관글 등에서 가벼운 데이터만 필요한 경우를 위한 경량 API
// 본문 변환을 생략하여 Notion 호출 비용과 변환 시간을 절약합니다.
export const getAllPostsSummary = cache(async (): Promise<BlogPost[]> => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        // 목록에서는 본문 변환 생략(cover 없을 때는 자동 OG 이미지로 대체)
        return await convertNotionPageToBlogPost(page, false);
      })
    );

    const publishedPosts = (posts.filter(Boolean) as BlogPost[]).filter(
      (post) => post.status && post.status.toLowerCase() === "published"
    );

    publishedPosts.sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

    return publishedPosts;
  } catch (error) {
    console.error("Error fetching posts summary:", error);
    return [];
  }
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    // 데이터베이스 스키마에서 실제 존재하는 슬러그 속성명을 확인
    const slugPropName = await resolveExistingPropertyName(["Slug", "슬러그"]);

    if (!slugPropName) {
      // 슬러그 속성이 없으면 전체 글에서 수동으로 매칭
      const all = await getAllPosts();
      return all.find((p) => p.slug === slug) || null;
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: slugPropName,
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });

    if (response.results.length > 0) {
      const page = response.results[0];
      return await convertNotionPageToBlogPost(page as any, true);
    }

    // 슬러그 속성이 존재하지만 비어있을 수 있으므로, 전체 글에서 계산된 슬러그로 재탐색
    const all = await getAllPosts();
    return all.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  }
});

export const getFeaturedPosts = cache(async (limit: number = 3): Promise<BlogPost[]> => {
  try {
    // 추천글 필터만 유지(있지 않아도 동작하도록 오류 시 하위 로직에서 보완)
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Featured",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: limit,
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await convertNotionPageToBlogPost(page);
      })
    );

    // 게시 상태 필터링 및 발행일 정렬
    const publishedPosts = (posts.filter(Boolean) as BlogPost[]).filter(
      (post) => post.status && post.status.toLowerCase() === "published"
    );
    publishedPosts.sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

    return publishedPosts;
  } catch (error) {
    // 추천글 속성이 없거나 스키마 차이로 실패 시, 전체 글에서 최신순 상위 N개를 제공
    console.error("Error fetching featured posts:", error);
    const all = await getAllPosts();
    return all.slice(0, limit);
  }
});

export const getPostsByCategory = cache(async (category: string): Promise<BlogPost[]> => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        return await convertNotionPageToBlogPost(page);
      })
    );

    const filtered = (posts.filter(Boolean) as BlogPost[])
      .filter((post) => post.status && post.status.toLowerCase() === "published")
      .filter((post) => post.category && post.category.toLowerCase() === category.toLowerCase());

    filtered.sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });

    return filtered;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
});

async function convertNotionPageToBlogPost(
  page: DatabaseQueryResult,
  includeContent: boolean = false
): Promise<BlogPost | null> {
  try {
    const properties = page.properties;

    // 필수 속성들 확인 (영/한 키 모두 지원, 타이틀은 타입 탐색)
    const titleProp = getTitleProperty(properties);
    const title = getPropertyValue(titleProp);

    let slug = getPropertyValue(getPropertyByNames(properties, ["Slug", "슬러그"]));

    const statusValue = getPropertyValue(getPropertyByNames(properties, ["Status", "상태"]));
    const status = typeof statusValue === "string" ? statusValue.toLowerCase() : null;

    if (!title || status !== "published") {
      return null;
    }

    // 슬러그가 없으면 제목 기반으로 자동 생성 (고유성 확보를 위해 페이지 ID 일부 추가)
    if (!slug) {
      slug = generateSlug(title, page.id);
    }

    let content = "";
    if (includeContent) {
      const mdblocks = await n2m.pageToMarkdown(page.id);
      content = n2m.toMarkdownString(mdblocks).parent;
    }

    // 읽기 시간 계산 (대략적으로 분당 200단어 기준)
    const readTime = content ? Math.ceil(content.split(" ").length / 200) : undefined;

    return {
      id: page.id,
      title,
      slug,
      author:
        getAuthorValue(
          getPropertyByNames(properties, ["Author", "작성자", "Authors", "작성자들"])
        ) || "알 수 없음",
      excerpt: getPropertyValue(getPropertyByNames(properties, ["Excerpt", "요약"])) || "",
      content,
      category:
        getPropertyValue(getPropertyByNames(properties, ["Category", "카테고리"])) || "기타",
      tags: getArrayPropertyValue(getPropertyByNames(properties, ["Tags", "태그"])) || [],
      // 발행일 속성명이 다른 경우(예: 한글) 대비 간단한 보강
      publishedAt:
        getDatePropertyValue(
          getPropertyByNames(properties, ["Published", "발행일", "게시일", "출간일"])
        ) || page.created_time,
      updatedAt: page.last_edited_time,
      status: (status as "published" | "draft") || "published",
      coverImage:
        getCoverImage(page.cover) ||
        // 목록/상세 모두에서 가능하면 본문 첫 이미지 사용
        extractFirstImageFromMarkdown(content) ||
        getAutoOgImage(
          title,
          getPropertyValue(getPropertyByNames(properties, ["Category", "카테고리"])) || undefined
        ),
      readTime,
    };
  } catch (error) {
    console.error("Error converting Notion page to blog post:", error);
    return null;
  }
}

function getPropertyValue(property: any): string | null {
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title?.[0]?.plain_text || null;
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || null;
    case "select":
      return property.select?.name || null;
    case "checkbox":
      return property.checkbox;
    default:
      return null;
  }
}

function getArrayPropertyValue(property: any): string[] | null {
  if (!property) return null;

  switch (property.type) {
    case "multi_select":
      return property.multi_select?.map((item: any) => item.name) || [];
    default:
      return null;
  }
}

function getDatePropertyValue(property: any): string | null {
  if (!property) return null;

  switch (property.type) {
    case "date":
      return property.date?.start || null;
    default:
      return null;
  }
}

function getCoverImage(cover: any): string | undefined {
  if (!cover) return undefined;

  switch (cover.type) {
    case "external":
      return cover.external?.url;
    case "file":
      return cover.file?.url;
    default:
      return undefined;
  }
}

// 다양한 언어의 속성명을 지원하기 위한 헬퍼들
function getPropertyByNames(properties: Record<string, any>, names: string[]): any | undefined {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(properties, name)) return properties[name];
  }
  return undefined;
}

function getTitleProperty(properties: Record<string, any>): any | undefined {
  // 우선 영/한 흔한 명칭으로 조회
  const byName = getPropertyByNames(properties, ["Title", "제목", "Name", "이름"]);
  if (byName && byName.type === "title") return byName;
  // 실패 시 타입이 title인 첫 프로퍼티 탐색
  for (const key of Object.keys(properties)) {
    const prop = properties[key];
    if (prop?.type === "title") return prop;
  }
  return undefined;
}

// 데이터베이스 스키마 조회(캐시)
const getDatabaseSchema = cache(async () => {
  return await notion.databases.retrieve({ database_id: databaseId });
});

async function resolveExistingPropertyName(candidateNames: string[]): Promise<string | null> {
  try {
    const schema: any = await getDatabaseSchema();
    const props: Record<string, any> = schema?.properties ?? {};
    for (const name of candidateNames) {
      if (Object.prototype.hasOwnProperty.call(props, name)) return name;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper: 작성자 속성 추출 (people, rich_text, select 지원)
function getAuthorValue(property: any): string | null {
  if (!property) return null;
  switch (property.type) {
    case "people": {
      const first = property.people?.[0];
      return first?.name || first?.person?.email || null;
    }
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || null;
    case "select":
      return property.select?.name || null;
    case "title":
      return property.title?.[0]?.plain_text || null;
    default:
      return null;
  }
}

// Helper: 제목 기반 슬러그 생성
function generateSlug(title: string, pageId?: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const suffix = pageId
    ? `-${pageId
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(-6)
        .toLowerCase()}`
    : "";
  return `${base}${suffix}`;
}

// Helper: 마크다운에서 첫 번째 이미지 URL 추출
function extractFirstImageFromMarkdown(markdown: string): string | undefined {
  if (!markdown) return undefined;
  const match = markdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match?.[1];
}

// Helper: 자동 OG 이미지 생성 URL
function getAutoOgImage(title: string, category?: string): string {
  const text = encodeURIComponent(title);
  const sub = category ? encodeURIComponent(category) : "";
  const titlePart = `${text}.png`;
  const query = `?theme=light&md=1&fontSize=64px${sub ? `&subtitle=${sub}` : ""}`;
  return `https://og-image.vercel.app/${titlePart}${query}`;
}
