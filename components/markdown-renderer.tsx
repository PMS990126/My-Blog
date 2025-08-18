"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme } = useTheme();
  const SyntaxHighlighter = dynamic(
    async () => {
      const mod = await import("react-syntax-highlighter");
      return mod.Prism;
    },
    { ssr: false }
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");

          if (!inline && match) {
            return (
              <SyntaxHighlighter
                style={theme === "dark" ? vscDarkPlus : vs}
                language={match[1]}
                PreTag="div"
                className="rounded-lg"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          }

          return (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
              {children}
            </code>
          );
        },
        img({ src, ...props }: any) {
          if (!src) return null;
          // div로 감싸면 p 내부에 block이 중첩되어 hydration 에러가 발생할 수 있음
          return (
            <Image
              src={src}
              alt=""
              width={800}
              height={600}
              sizes="100vw"
              className="mx-auto my-6 rounded-lg"
              {...props}
            />
          );
        },
        blockquote({ children, ...props }: any) {
          return (
            <blockquote
              className="my-4 rounded-r-lg border-l-4 border-primary bg-muted/50 py-2 pl-4 italic"
              {...props}
            >
              {children}
            </blockquote>
          );
        },
        table({ children, ...props }: any) {
          return (
            <div className="my-6 overflow-x-auto">
              <table className="min-w-full rounded-lg border border-border" {...props}>
                {children}
              </table>
            </div>
          );
        },
        th({ children, ...props }: any) {
          return (
            <th
              className="border-b border-border bg-muted px-4 py-2 text-left font-semibold"
              {...props}
            >
              {children}
            </th>
          );
        },
        td({ children, ...props }: any) {
          return (
            <td className="border-b border-border px-4 py-2" {...props}>
              {children}
            </td>
          );
        },
        a({ href, children, ...props }: any) {
          return (
            <a
              href={href}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              {...props}
            >
              {children}
            </a>
          );
        },
        h1({ children, ...props }: any) {
          return (
            <h1 className="mb-4 mt-8 border-b border-border pb-2 text-3xl font-bold" {...props}>
              {children}
            </h1>
          );
        },
        h2({ children, ...props }: any) {
          return (
            <h2 className="mb-4 mt-8 text-2xl font-semibold" {...props}>
              {children}
            </h2>
          );
        },
        h3({ children, ...props }: any) {
          return (
            <h3 className="mb-3 mt-6 text-xl font-semibold" {...props}>
              {children}
            </h3>
          );
        },
        ul({ children, ...props }: any) {
          return (
            <ul className="my-4 ml-4 list-inside list-disc space-y-2" {...props}>
              {children}
            </ul>
          );
        },
        ol({ children, ...props }: any) {
          return (
            <ol className="my-4 ml-4 list-inside list-decimal space-y-2" {...props}>
              {children}
            </ol>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
