import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";
import { Calendar } from "lucide-react";
import { BlogPost } from "@/lib/notion";
import { formatDate } from "@/lib/utils";

interface BlogPostCardProps {
  post: BlogPost;
  variant?: "card" | "list";
}

export function BlogPostCard({ post, variant = "card" }: BlogPostCardProps) {
  if (variant === "list") {
    return (
      <article className="group relative rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-md dark:border-white/15 dark:hover:border-white/25 dark:hover:bg-white/5">
        <Link
          href={`/blog/${post.slug}`}
          prefetch={false}
          className="absolute inset-0 z-10"
          aria-label={post.title}
        />
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 썸네일 */}
          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg md:aspect-auto md:h-32 md:w-48 md:flex-shrink-0">
              <SafeImage
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                fallbackSrc="/file.svg"
              />
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {post.category}
              </span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>
              </div>
            </div>

            <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-card-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>

            <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 4 && (
                  <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    +{post.tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 기존 카드 스타일
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:bg-muted/40 hover:shadow-lg dark:border-white/15 dark:hover:border-white/25 dark:hover:bg-white/5">
      <Link
        href={`/blog/${post.slug}`}
        prefetch={false}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackSrc="/file.svg"
          />
        </div>
      )}

      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>
        </div>

        <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h2>

        <p className="mb-4 line-clamp-3 text-muted-foreground">{post.excerpt}</p>

        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
