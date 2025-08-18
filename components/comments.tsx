"use client";

import { useEffect, useRef, useState } from "react";

// 인터섹션 옵저버로 화면에 보일 때만 스크립트 주입
function useOnScreen(ref: React.RefObject<Element | null>, rootMargin: string = "0px") {
  const isVisibleRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return isVisible;
}

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref, "200px");

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;
    // 화면에 근접했을 때만 로드
    if (!isVisible) return;

    const scriptElem = document.createElement("script");
    scriptElem.src = "https://giscus.app/client.js";
    scriptElem.async = true;
    scriptElem.crossOrigin = "anonymous";

    scriptElem.setAttribute("data-repo", process.env.NEXT_PUBLIC_GISCUS_REPO || "");
    scriptElem.setAttribute("data-repo-id", process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "");
    scriptElem.setAttribute("data-category", process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General");
    scriptElem.setAttribute("data-category-id", process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "");
    scriptElem.setAttribute("data-mapping", "pathname");
    scriptElem.setAttribute("data-strict", "0");
    scriptElem.setAttribute("data-reactions-enabled", "1");
    scriptElem.setAttribute("data-emit-metadata", "0");
    scriptElem.setAttribute("data-input-position", "bottom");
    scriptElem.setAttribute("data-theme", "preferred_color_scheme");
    scriptElem.setAttribute("data-lang", "ko");

    ref.current.appendChild(scriptElem);
  }, [isVisible]);

  // 환경 변수가 설정되지 않은 경우 대체 UI 표시
  if (!process.env.NEXT_PUBLIC_GISCUS_REPO) {
    return (
      <div className="rounded-lg bg-muted/50 p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold text-foreground">댓글 시스템</h3>
        <p className="text-muted-foreground">
          댓글 기능을 사용하려면 Giscus 설정이 필요합니다.
          <br />
          <code className="mt-2 inline-block rounded bg-muted px-2 py-1 text-sm">
            .env.local
          </code>{" "}
          파일에서 Giscus 환경 변수를 설정해주세요.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">댓글</h3>
      <div ref={ref} />
    </div>
  );
}
