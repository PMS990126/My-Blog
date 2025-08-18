"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

export function SafeImage({ fallbackSrc, alt, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed && (props as any).src) {
    const src = (props as any).src as string;
    // fallback: 기본 img로 렌더링 (Next Image 제약 우회)
    return (
      // fill 대응: 부모 컨테이너가 position:relative여야 하며, objectFit 유지
      <img
        src={fallbackSrc || src}
        alt={alt || ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return <Image {...props} alt={alt} onError={() => setFailed(true)} />;
}
