"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryFilterProps {
  categories: string[];
  currentCategory?: string;
}

export function CategoryFilter({ categories, currentCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams();

  const createCategoryUrl = (category?: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    return `/blog?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createCategoryUrl()}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !currentCategory
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        전체
      </Link>

      {categories.map((category) => (
        <Link
          key={category}
          href={createCategoryUrl(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
