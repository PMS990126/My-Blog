"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CategorySidebar } from "./category-sidebar";

interface MobileSidebarProps {
  categories: string[];
  posts: Array<{
    category: string;
    tags: string[];
    publishedAt: string;
  }>;
  nowIso?: string;
}

export function MobileSidebar({ categories, posts, nowIso }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-20 z-40 rounded-lg border border-border bg-card p-2 shadow-lg lg:hidden"
        aria-label="사이드바 열기"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[85vw] max-w-[360px] transform border-r border-border bg-background transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">메뉴</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="사이드바 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100%-56px)] flex-col overflow-y-auto p-4">
          <CategorySidebar categories={categories} posts={posts} nowIso={nowIso} />
        </div>
      </div>
    </>
  );
}
