export const revalidate = 300;
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Metadata } from "next";
import Script from "next/script";
import { Comments } from "@/components/comments";
import { RelatedPosts } from "@/components/related-posts";
import { PostViews } from "@/components/post-views";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 페이지별 메타데이터를 설정하지 않아 전역(레이아웃)의 타이틀을 유지합니다
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = await getPostBySlug(decoded);
  if (!post) return {} as Metadata;
  const title = post.title;
  const description = post.excerpt || post.title;
  const ogImage = post.coverImage;
  return {
    title: `${title}`,
    description,
    alternates: {
      canonical: `https://my-blog.com/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://my-blog.com/blog/${post.slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  } satisfies Metadata;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = await getPostBySlug(decoded);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <article className="min-w-0 flex-1">
            {/* Back Button removed as requested */}

            {/* Post Header */}
            <header className="mb-8">
              {/* Cover image removed as requested */}

              <div className="mb-4 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {post.category}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold text-foreground lg:text-5xl">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>

                {/* read time intentionally omitted */}

                <PostViews slug={post.slug} />

                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?search=${encodeURIComponent(tag)}`}
                          prefetch={false}
                          className="transition-colors hover:text-foreground"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>

            {/* JSON-LD Article */}
            <Script id="ld-article" type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt || post.title,
                author: [{ "@type": "Person", name: post.author || "PMS" }],
                datePublished: post.publishedAt,
                dateModified: post.updatedAt,
                image: post.coverImage ? [post.coverImage] : undefined,
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `https://my-blog.com/blog/${post.slug}`,
                },
                publisher: {
                  "@type": "Organization",
                  name: "PMS Dev Blog",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://my-blog.com/favicon.svg",
                  },
                },
              })}
            </Script>

            {/* Post Content */}
            <div className="prose prose-neutral dark:prose-invert mb-12 max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Related Posts */}
            <RelatedPosts currentPost={post} />

            {/* Comments */}
            <div className="mt-12 border-t border-border pt-8">
              <Comments />
            </div>
          </article>

          {/* Right Sidebar - User Profile (숨김) */}
        </div>
      </div>
    </div>
  );
}
