import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "PMS Dev Blog",
  description: "프론트엔드 개발자가 되기 위해 내가 학습한 기술과 경험을 기록하는 장소",
  keywords: ["개발블로그", "프론트엔드", "React", "Next.js", "TypeScript", "웹개발"],
  authors: [{ name: "PMS" }],
  creator: "PMS",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://my-blog.com",
    title: "PMS Dev Blog",
    description: "프론트엔드 개발자가 되기 위해 내가 학습한 기술과 경험을 기록하는 장소",
    siteName: "PMS Dev Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMS Dev Blog",
    description: "프론트엔드 개발자가 되기 위해 내가 학습한 기술과 경험을 기록하는 장소",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
