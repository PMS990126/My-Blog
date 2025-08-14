"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    router.push(`/blog?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative mx-auto max-w-md">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <input
          type="text"
          placeholder="포스트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-background border-border focus:ring-primary w-full rounded-lg border py-3 pr-10 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
