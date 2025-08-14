import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogPost, getAllPosts } from "@/lib/notion";
import { BlogPostCard } from "./blog-post-card";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export async function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const allPosts = await getAllPosts();

  const relatedPosts = allPosts
    .filter((post) => post.id !== currentPost.id)
    .filter((post) => {
      const sameCategory = post.category === currentPost.category;
      const sharedTag = post.tags.some((tag) => currentPost.tags.includes(tag));
      return sameCategory || sharedTag; // 제목 유사도 조건 제거
    })
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return (
      <section className="border-t border-border pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">관련 포스트</h2>
          <Link
            href="/blog"
            className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary/80"
          >
            모든 포스트 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <p className="text-muted-foreground">관련 포스트가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="border-t border-border pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">관련 포스트</h2>
        <Link
          href="/blog"
          className="inline-flex items-center font-medium text-primary transition-colors hover:text-primary/80"
        >
          모든 포스트 보기
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
