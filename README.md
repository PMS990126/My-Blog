# 🚀 개인 개발 블로그

Next.js 15와 Notion API를 활용한 현대적인 개인 개발 블로그입니다. 3단 레이아웃으로 구성되어 있으며, 카테고리 필터링과 사용자 프로필을 포함한 완전한 블로그 경험을 제공합니다.

## ✨ 주요 기능

### 🎨 **모던한 UI/UX**

- **3단 레이아웃**: 좌측 카테고리 사이드바, 중앙 포스트 목록, 우측 사용자 프로필
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 대응
- **다크모드**: 시스템 설정 연동 자동 테마 전환
- **애니메이션**: Framer Motion 기반 부드러운 인터랙션

### 📝 **블로그 핵심 기능**

- **Notion CMS**: Notion을 데이터베이스로 활용한 블로그 포스트 관리
- **카테고리 필터링**: 좌측 사이드바를 통한 직관적인 포스트 분류
- **검색 기능**: 제목, 내용, 태그 기반 포스트 검색
- **마크다운 렌더링**: 코드 하이라이팅, 이미지, 링크 등 완전한 마크다운 지원
- **SEO 최적화**: 동적 메타데이터, 사이트맵, robots.txt

### 💬 **소셜 기능**

- **댓글 시스템**: Giscus 기반 GitHub Discussions 댓글
- **소셜 공유**: 각 포스트별 소셜 미디어 공유 기능

### ⚡ **성능 최적화**

- **ISR (Incremental Static Regeneration)**: 최적의 성능과 실시간 업데이트
- **이미지 최적화**: Next.js Image 컴포넌트 활용
- **코드 스플리팅**: 자동 번들 최적화

## 🛠 기술 스택

### Frontend

- **Next.js 15**: App Router, Server Components, ISR
- **React 19**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장

### Styling & UI

- **Tailwind CSS 3.x**: 유틸리티 기반 스타일링
- **ShadcnUI**: 아름답고 접근성을 고려한 컴포넌트 시스템
- **Radix UI**: 무장애 UI 컴포넌트 기반

### Content & Data

- **Notion API**: 헤드리스 CMS로 활용
- **notion-to-md**: Notion 블록을 마크다운으로 변환
- **React Markdown**: 마크다운 렌더링
- **React Syntax Highlighter**: 코드 블록 하이라이팅

### Additional

- **Framer Motion**: 애니메이션 및 전환 효과
- **next-themes**: 다크모드 구현
- **date-fns**: 날짜 포맷팅
- **Giscus**: GitHub Discussions 기반 댓글

## 📁 프로젝트 구조

```
my-blog/
├── app/                           # Next.js App Router
│   ├── blog/                      # 블로그 관련 페이지
│   │   ├── [slug]/                # 개별 포스트 페이지
│   │   │   └── page.tsx           # 동적 포스트 상세 페이지
│   │   └── page.tsx               # 블로그 목록 페이지 (검색 포함)
│   ├── globals.css                # 전역 스타일 (Tailwind CSS)
│   ├── layout.tsx                 # 루트 레이아웃 (SEO, 네비게이션, 테마)
│   ├── page.tsx                   # 홈페이지 (메인 블로그 목록)
│   ├── loading.tsx                # 로딩 UI
│   ├── not-found.tsx              # 404 페이지
│   ├── sitemap.ts                 # 동적 사이트맵 생성
│   ├── robots.ts                  # SEO용 robots.txt
│   └── manifest.ts                # PWA 매니페스트
├── components/                    # 재사용 가능한 컴포넌트
│   ├── blog-header.tsx            # 블로그 메인 헤더
│   ├── blog-post-card.tsx         # 포스트 카드 (card/list 두 가지 variant)
│   ├── category-sidebar.tsx       # 좌측 카테고리 사이드바
│   ├── mobile-sidebar.tsx         # 모바일용 사이드바
│   ├── user-profile.tsx           # 우측 사용자 프로필
│   ├── navigation.tsx             # 상단 네비게이션
│   ├── footer.tsx                 # 하단 푸터
│   ├── theme-provider.tsx         # 다크모드 테마 제공자
│   ├── theme-toggle.tsx           # 테마 전환 버튼
│   ├── search-box.tsx             # 검색 입력 컴포넌트
│   ├── markdown-renderer.tsx      # 마크다운 렌더링 컴포넌트
│   ├── comments.tsx               # Giscus 댓글 컴포넌트
│   └── ui/                        # ShadcnUI 기본 컴포넌트
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       └── ...
├── lib/                           # 유틸리티 및 설정
│   ├── notion.ts                  # Notion API 연동 로직
│   └── utils.ts                   # 헬퍼 함수 (cn, clsx 등)
├── public/                        # 정적 파일
│   ├── favicon.ico
│   └── images/
├── .env.local.example             # 환경 변수 예시
├── next.config.ts                 # Next.js 설정
├── tailwind.config.js             # Tailwind CSS 설정
├── tsconfig.json                  # TypeScript 설정
├── components.json                # ShadcnUI 설정
└── package.json                   # 프로젝트 의존성
```

## 🚀 프로젝트 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd my-blog
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수들을 설정합니다:

```env
# Notion API 설정
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id

# 사이트 설정
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Giscus 댓글 시스템 설정
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your_repo_id
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your_category_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 📝 Notion API 설정 가이드

### Step 1: Notion Integration 생성

1. [Notion Integrations 페이지](https://www.notion.so/my-integrations)에 접속
2. **"+ New integration"** 클릭
3. 다음 정보 입력:
   - **Name**: "My Blog Integration" (원하는 이름)
   - **Logo**: 선택사항
   - **Associated workspace**: 블로그 데이터베이스가 있는 워크스페이스 선택
4. **"Submit"** 클릭
5. **"Internal Integration Token"** 복사 → `.env.local`의 `NOTION_TOKEN`에 설정

### Step 2: Notion 데이터베이스 생성

블로그 포스트용 Notion 데이터베이스를 다음 속성으로 생성합니다:

| 속성명 (영문)  | 속성명 (한글) | 타입          | 필수 | 설명                                               |
| -------------- | ------------- | ------------- | ---- | -------------------------------------------------- |
| **Title**      | 제목          | Title         | ✅   | 포스트 제목                                        |
| **Slug**       | 슬러그        | Rich text     | ✅   | URL용 고유 식별자 (예: "my-first-post")            |
| **Status**     | 상태          | Select        | ✅   | 옵션: "Published", "Draft"                         |
| **Category**   | 카테고리      | Select        | ❌   | 포스트 분류 (예: "React", "Next.js", "JavaScript") |
| **Tags**       | 태그          | Multi-select  | ❌   | 포스트 태그들                                      |
| **Excerpt**    | 요약          | Rich text     | ❌   | 포스트 짧은 요약 (메타데이터용)                    |
| **Published**  | 발행일        | Date          | ❌   | 포스트 발행 날짜                                   |
| **Featured**   | 추천글        | Checkbox      | ❌   | 추천 포스트 여부                                   |
| **CoverImage** | 커버이미지    | Files & media | ❌   | 포스트 썸네일 이미지                               |

### Step 3: 데이터베이스 공유 설정

1. 생성한 데이터베이스 페이지에서 우상단 **"Share"** 버튼 클릭
2. **"Invite"** 섹션에서 생성한 Integration 이름 검색
3. Integration 선택 후 **"Invite"** 클릭
4. 권한이 **"Can edit"**로 설정되어 있는지 확인

### Step 4: 데이터베이스 ID 가져오기

1. 데이터베이스 페이지 URL에서 ID 추출:
   ```
   https://www.notion.so/your-workspace/DATABASE_ID?v=...
   ```
2. 32자리 ID를 `.env.local`의 `NOTION_DATABASE_ID`에 설정

### Step 5: 테스트 포스트 작성

데이터베이스에 다음과 같은 테스트 포스트를 작성해보세요:

- **Title**: "안녕하세요! 첫 번째 포스트입니다"
- **Slug**: "hello-world"
- **Status**: "Published"
- **Category**: "일반"
- **Published**: 오늘 날짜

포스트 내용은 Notion 페이지 내용으로 작성하면 됩니다.

## 💬 Giscus 댓글 시스템 설정 가이드

### Step 1: GitHub 저장소 준비

1. 블로그용 GitHub 저장소 생성 (public 저장소여야 함)
2. 저장소 Settings → General → Features에서 **"Discussions"** 체크박스 활성화

### Step 2: Giscus 앱 설치

1. [GitHub Apps - Giscus](https://github.com/apps/giscus) 페이지 접속
2. **"Install"** 버튼 클릭
3. 블로그 저장소 선택하여 설치

### Step 3: Giscus 설정값 생성

1. [Giscus 설정 페이지](https://giscus.app/ko) 접속
2. **저장소** 필드에 `your-username/your-repo` 형식으로 입력
3. **페이지 ↔️ discussions 매핑** → **"pathname"** 선택 권장
4. **Discussion 카테고리** → **"General"** 또는 원하는 카테고리 선택
5. **기능** → 원하는 옵션들 선택
6. **테마** → **"preferred_color_scheme"** 선택 (다크모드 자동 연동)

### Step 4: 환경 변수 설정

생성된 설정값을 `.env.local`에 추가:

```env
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOH... (자동 생성된 값)
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOH... (자동 생성된 값)
```

## 🎯 블로그 동작 방식

### 1. 홈페이지 (`/`)

- 최신 포스트들을 카드 형태로 표시
- 좌측: 카테고리별 필터링 사이드바
- 우측: 사용자 프로필 (프로필 이미지, 닉네임, 소개, GitHub 링크)
- 중앙: 포스트 목록 (리스트 형태)

### 2. 블로그 페이지 (`/blog`)

- 검색 기능이 포함된 전체 포스트 목록
- 카테고리 및 검색어로 필터링 가능
- 동일한 3단 레이아웃 구조

### 3. 개별 포스트 페이지 (`/blog/[slug]`)

- Notion 페이지 내용을 마크다운으로 렌더링
- 코드 블록 하이라이팅 지원
- 하단에 Giscus 댓글 시스템
- 우측에 사용자 프로필 유지

### 4. 데이터 흐름

```
Notion Database → Notion API → notion-to-md → React Markdown → HTML
```

### 5. 카테고리 시스템

- Notion의 Select 속성을 활용
- 자동으로 카테고리 목록 생성
- URL 파라미터를 통한 필터링 (`/?category=React`)

## 🎨 커스터마이징 가이드

### 사용자 프로필 수정

`components/user-profile.tsx`에서 다음 정보를 수정할 수 있습니다:

```tsx
// 프로필 정보 수정
<h3 className="text-lg font-bold text-card-foreground">김개발</h3>

// 소개말 수정
<p className="text-center text-sm leading-relaxed text-muted-foreground">
  프론트엔드 개발자입니다. 사용자 경험을 중시하며 깔끔하고 효율적인 코드를 작성합니다.
</p>

// GitHub 링크 수정
<a href="https://github.com/your-username" target="_blank" rel="noopener noreferrer">
```

### 테마 색상 변경

`app/globals.css`의 CSS 변수를 수정:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 98%;
  /* 다른 색상 변수들... */
}
```

### 블로그 제목 및 설명 변경

`components/blog-header.tsx`에서 수정:

```tsx
<h1 className="mb-4 text-4xl font-bold text-foreground">김개발의 기술 블로그</h1>
<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
  프론트엔드 개발자로서 학습한 기술과 경험을 공유하는 공간입니다.
</p>
```

## 🚀 배포 가이드

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com) 계정 생성 및 로그인
2. **"New Project"** → GitHub 저장소 연결
3. **Environment Variables** 섹션에서 환경 변수 설정:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
   - `NEXT_PUBLIC_SITE_URL` (배포된 도메인으로 설정)
   - `NEXT_PUBLIC_GISCUS_*` (모든 Giscus 설정값)
4. **"Deploy"** 클릭
5. 자동 배포 완료 후 도메인 확인

### 기타 플랫폼 배포

```bash
# 프로덕션 빌드
npm run build

# 서버 실행
npm start
```

## 🔧 트러블슈팅

### 자주 발생하는 문제들

1. **Notion API 연결 실패**

   - Integration Token 확인
   - 데이터베이스 공유 권한 확인
   - 데이터베이스 ID 정확성 확인

2. **댓글이 표시되지 않음**

   - GitHub Discussions 활성화 확인
   - Giscus 앱 설치 확인
   - Repository ID와 Category ID 정확성 확인

3. **빌드 오류**
   - Node.js 버전 확인 (18+ 권장)
   - 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🤝 기여 방법

1. 이 저장소를 Fork
2. 새로운 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📞 지원 및 문의

- 🐛 버그 리포트: [Issues](https://github.com/your-username/your-repo/issues)
- 💡 기능 제안: [Discussions](https://github.com/your-username/your-repo/discussions)
- 📧 직접 문의: your-email@example.com

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!
