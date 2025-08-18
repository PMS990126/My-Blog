"use client";

import Image from "next/image";
import { Github } from "lucide-react";
import { VisitsWidget } from "@/components/visits-widget";

export function UserProfile() {
  return (
    <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
      {/* 프로필 이미지 */}
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 h-32 w-32">
          <Image
            src="/profile.png"
            alt="PMS Profile"
            fill
            className="rounded-full object-cover"
            sizes="128px"
            priority
          />
        </div>

        <h3 className="text-lg font-bold text-card-foreground">PMS</h3>
      </div>

      {/* 간단한 소개 */}
      <div className="mb-6">
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          하루하루 성장해나가는 프론트엔드 개발자
        </p>
      </div>

      {/* GitHub 링크 */}
      <div className="flex justify-center">
        <a
          href="https://github.com/PMS990126"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>

      <VisitsWidget />
    </div>
  );
}
