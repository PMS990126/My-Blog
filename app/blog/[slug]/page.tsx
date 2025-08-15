import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Comments } from "@/components/comments";
import { RelatedPosts } from "@/components/related-posts";

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = await getPostBySlug(decoded);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: post.coverImage ? [post.coverImage] : [],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
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

                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?search=${encodeURIComponent(tag)}`}
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
