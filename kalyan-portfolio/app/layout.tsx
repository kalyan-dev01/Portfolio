import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteSettings } from "@/lib/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.site_title || "M Hemasatya Kalyan | Full-Stack Developer & AI/GenAI Developer";
  const description =
    settings?.meta_description ||
    "Full-stack and AI/GenAI developer portfolio of M Hemasatya Kalyan — React, Node.js, Python, LLMs and RAG.";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/favicon.svg",
    },
    alternates: { canonical: "/" },
  };
}

// Sets the theme class before first paint so there's no flash of the
// wrong theme, and falls back to the system preference on first visit.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-bg text-text`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
