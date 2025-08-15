## PMS Dev Blog

Next.js App Router와 Notion을 헤드리스 CMS로 사용해 만든 개인 개발 블로그. 반응형·다크모드·SEO에 최적화되어 있으며, 글쓰기는 Notion에서 편하게 하고, 블로그에서는 자동으로 보기 좋게 렌더링되는 구조.

### ✨ 하이라이트

- **Notion을 CMS로 사용**: 노션에서 글을 작성하면 블로그에 자동 반영
- **슬러그 자동 생성**: 노션에서 슬러그를 입력하지 않아도 제목+페이지ID로 고유 슬러그 생성 및 라우팅
- **정확한 최근 활동**: 게시일(publishedAt) 기준 월/주 집계, 주간은 월~일 기준
- **강력한 검색**: 제목/요약/태그/카테고리 + 한글/영문/대소문/약어 동의어 매칭 (예: 자바스크립트/javascript/js)
- **자동 썸네일**: 노션 커버 → 본문 첫 이미지 → 자동 OG 이미지 순서로 활용
- **깔끔하고 모던한 UI/UX**: 다크모드 테두리 개선, 단순한 404, 모바일 사이드바 스크롤 개선
- **개발 경험**: TypeScript, ESLint/Prettier, TailwindCSS로 일관된 품질 유지

---

### 🧭 목차

- 개요
- 기술 스택
- 프로젝트 구조
- 데이터 모델
- 환경 변수
- 로컬 개발
- 동작 방식
  - Notion 연동과 속성 매핑
  - 라우팅과 슬러그 폴백
  - 카테고리 그룹핑 규칙
  - 동의어 기반 검색
  - 썸네일과 이미지 처리
  - 최근 활동 집계
  - 404/모바일 사이드바 UX
- SEO & 메타
- 비고 및 향후 작업

---

### 개요

이 프로젝트는 나만의 개인적인 개발 블로그를 직접 만들어 보는 것. 게시글은 노션에서 작성하고, 사이트는 해당 데이터를 빌드 타임에 가져와 마크다운으로 변환해 렌더링하며 카테고리/검색/사이드바 등 블로그 탐색 기능을 제공.

---

### 기술 스택

- 프레임워크: Next.js 15 (App Router), React 19, TypeScript
- 스타일링: TailwindCSS, tailwindcss-animate
- 테마: next-themes (다크/라이트)
- 아이콘: lucide-react
- CMS: Notion (`@notionhq/client`, `notion-to-md`)
- 마크다운: react-markdown, remark-gfm, react-syntax-highlighter (Prism)
- 도구: ESLint, Prettier, Prettier Tailwind 플러그인

---

### 프로젝트 구조

```text
app/
  page.tsx                # 홈 피드(리스트), 반응형 + 카테고리 사이드바
  blog/
    page.tsx              # 전체 글(검색 + 카테고리 필터)
    [slug]/page.tsx       # 글 상세 (동적 라우트)
  layout.tsx              # 전역 레이아웃/메타데이터/네비/푸터
  not-found.tsx           # 404 페이지
  sitemap.ts, robots.ts   # SEO 엔드포인트
  manifest.ts             # PWA 매니페스트

components/
  blog-post-card.tsx      # 카드/리스트 변형; 모바일에서 일관되게 동작
  category-sidebar.tsx    # 카테고리 집계 + 최근 활동(월/주)
  category-filter.tsx     # 그룹 라벨 필터 칩
  search-bar.tsx          # /blog?search=... 쿼리 빌드
  markdown-renderer.tsx   # 마크다운 렌더링/코드 하이라이트/이미지 처리
  related-posts.tsx       # 카테고리/태그 기반 관련 글
  navigation.tsx, footer.tsx, theme-provider.tsx, ...

lib/
  notion.ts               # Notion 클라이언트, 변환기, 데이터 조회, 슬러그 폴백
  utils.ts                # formatDate

public/
  favicon.svg             # 검정 배경 + 중앙 정렬 흰색 “P”
```

---

### 데이터 모델

`lib/notion.ts`는 노션 페이지를 다음 형태로 변환:

```ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string; // 비어있으면 자동 생성
  author: string;
  excerpt: string;
  content: string; // Markdown
  category: string;
  tags: string[];
  publishedAt: string; // Published/발행일/게시일/출간일 → 없으면 created_time
  updatedAt: string; // last_edited_time
  status: "published" | "draft";
  coverImage?: string; // cover → 본문 첫 이미지 → 자동 OG 이미지
}
```

지원하는 노션 속성(영/한 동시 지원):

- 제목: `Title` | `제목` | `Name` | `이름` (title)
- 상태: `Status` | `상태` (published일 때만 노출)
- 슬러그(선택): `Slug` | `슬러그` (rich_text)
- 요약: `Excerpt` | `요약`
- 카테고리: `Category` | `카테고리`
- 태그: `Tags` | `태그` (multi_select)
- 발행일: `Published` | `발행일` | `게시일` | `출간일`

슬러그가 비어 있으면 제목 기반으로 하이픈 케이스 + 페이지ID 일부를 붙여 고유하게 생성. 정적 파라미터/사이트맵/상세 라우팅에서 동일한 슬러그가 사용.

---

### 동작 방식

#### Notion 연동과 속성 매핑

- 지정된 노션 데이터베이스에서 모든 페이지를 조회
- `notion-to-md`로 블록을 마크다운으로 변환
- 속성은 영/한 이름을 모두 지원하고, 누락된 필드는 안전하게 기본 처리

#### 라우팅과 슬러그 폴백

- 상세 경로: `/blog/[slug]`
- 우선 `Slug/슬러그` 속성으로 조회, 없으면 제목 기반 자동 슬러그로 조회
- `generateStaticParams`/사이트맵에서도 동일 로직으로 일관성 유지

#### 카테고리 그룹핑 규칙

오분류를 막기 위해 의도 기반 그룹핑을 사용.

- HTML / CSS → html, css, sass, scss, tailwind
- React / Next.js → react, next.js, nextjs, next (이 그룹을 JS/TS보다 먼저 판별)
- JavaScript / TypeScript → javascript, typescript (js/ts 단일 토큰 제외)
- 상태관리 / 데이터 캐싱 → redux, recoil, zustand, jotai, state/상태, swr, react-query/tanstack, query, cache/캐시
- API / 보안 → api, rest, graphql/gql, axios, fetch, security, auth/인증, oauth, jwt, cors, csrf
- Build / Tooling → webpack, vite, rollup, esbuild, babel, eslint, prettier, husky, lint, tool/도구, build/빌드, ci/cd, turbo, nx
- 최적화 / Refactoring → optimize/최적화/performance/성능, refactor/리팩토링, memo, lazy, code split, tree shaking
- Test / QA → test, jest, vitest, rtl, cypress, playwright, qa, e2e, unit, integration

#### 동의어 기반 검색

제목/요약/태그/원본 카테고리/그룹 라벨에서 검색하며, 토큰을 동의어/약어/표기 변형으로 확장해 케이스 무시 매칭.

- 예: “자바스크립트”, “javascript”, “js” 모두 매칭
- 예: “넥스트”, “Next.js”, “nextjs”, “next js” 매칭
- 예: “인증”, “auth”, “oauth”, “jwt” 매칭
  모든 토큰을 만족(AND)해야 결과에 포함되어 정확도를 높임.

#### 썸네일과 이미지 처리

- 카드/리스트: 우선 `coverImage`; 없으면 본문 첫 이미지; 그래도 없으면 자동 OG 이미지 사용
- 마크다운 이미지: 파일명 캡션 없이 깔끔하게 렌더링

#### 최근 활동 집계

- 이번 달: 현재 월 1일 00:00 이후 게시글 수
- 이번 주: 월요일 00:00 ~ 일요일 23:59:59.999 범위, `publishedAt` 기준

#### 404/모바일 사이드바 UX

- 404: 홈/이전으로 돌아가기만 제공하는 단순 UI
- 모바일 사이드바: 긴 목록도 스크롤 가능하도록 높이/스크롤 개선, 백드롭 탭으로 닫힘

---

### SEO & 메타

- 전역 메타: `app/layout.tsx`
- 포스트별 메타: `app/blog/[slug]/page.tsx`
- Open Graph/Twitter, 사이트맵(`app/sitemap.ts`), robots(`app/robots.ts`)
- 파비콘: 검정 배경 + 중앙 정렬 흰색 “P” (`public/favicon.svg`)

---

### 비고 및 향후 작업

- `lib/notion.ts`에는 향후 기능 확장을 위한 `getFeaturedPosts`, `getPostsByCategory` 등이 포함되어 있음(현재 미사용).
- 콘텐츠가 늘어날수록 검색 동의어 사전과 카테고리 규칙을 도메인에 맞게 확장할 예정.
