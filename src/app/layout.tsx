import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
};

type AccentPalette = {
  "50": string;
  "100": string;
  "500": string;
  "600": string;
  glow: string;
  glowStrong: string;
  selection: string;
};

const ACCENT_COLORS: Record<string, AccentPalette> = {
  blue: {
    "50": "#eff6ff",
    "100": "#dbeafe",
    "500": "#3b82f6",
    "600": "#2563eb",
    glow: "rgba(59,130,246,0.35)",
    glowStrong: "rgba(59,130,246,0.5)",
    selection: "rgba(59,130,246,0.2)",
  },
  indigo: {
    "50": "#eef2ff",
    "100": "#e0e7ff",
    "500": "#6366f1",
    "600": "#4f46e5",
    glow: "rgba(99,102,241,0.35)",
    glowStrong: "rgba(99,102,241,0.5)",
    selection: "rgba(99,102,241,0.2)",
  },
  violet: {
    "50": "#f5f3ff",
    "100": "#ede9fe",
    "500": "#8b5cf6",
    "600": "#7c3aed",
    glow: "rgba(139,92,246,0.35)",
    glowStrong: "rgba(139,92,246,0.5)",
    selection: "rgba(139,92,246,0.2)",
  },
  purple: {
    "50": "#faf5ff",
    "100": "#f3e8ff",
    "500": "#a855f7",
    "600": "#9333ea",
    glow: "rgba(168,85,247,0.35)",
    glowStrong: "rgba(168,85,247,0.5)",
    selection: "rgba(168,85,247,0.2)",
  },
  pink: {
    "50": "#fdf2f8",
    "100": "#fce7f3",
    "500": "#ec4899",
    "600": "#db2777",
    glow: "rgba(236,72,153,0.35)",
    glowStrong: "rgba(236,72,153,0.5)",
    selection: "rgba(236,72,153,0.2)",
  },
  rose: {
    "50": "#fff1f2",
    "100": "#ffe4e6",
    "500": "#f43f5e",
    "600": "#e11d48",
    glow: "rgba(244,63,94,0.35)",
    glowStrong: "rgba(244,63,94,0.5)",
    selection: "rgba(244,63,94,0.2)",
  },
  red: {
    "50": "#fef2f2",
    "100": "#fee2e2",
    "500": "#ef4444",
    "600": "#dc2626",
    glow: "rgba(239,68,68,0.35)",
    glowStrong: "rgba(239,68,68,0.5)",
    selection: "rgba(239,68,68,0.2)",
  },
  orange: {
    "50": "#fff7ed",
    "100": "#ffedd5",
    "500": "#f97316",
    "600": "#ea580c",
    glow: "rgba(249,115,22,0.35)",
    glowStrong: "rgba(249,115,22,0.5)",
    selection: "rgba(249,115,22,0.2)",
  },
  amber: {
    "50": "#fffbeb",
    "100": "#fef3c7",
    "500": "#f59e0b",
    "600": "#d97706",
    glow: "rgba(245,158,11,0.35)",
    glowStrong: "rgba(245,158,11,0.5)",
    selection: "rgba(245,158,11,0.2)",
  },
  yellow: {
    "50": "#fefce8",
    "100": "#fef9c3",
    "500": "#eab308",
    "600": "#ca8a04",
    glow: "rgba(234,179,8,0.35)",
    glowStrong: "rgba(234,179,8,0.5)",
    selection: "rgba(234,179,8,0.2)",
  },
  green: {
    "50": "#f0fdf4",
    "100": "#dcfce7",
    "500": "#22c55e",
    "600": "#16a34a",
    glow: "rgba(34,197,94,0.35)",
    glowStrong: "rgba(34,197,94,0.5)",
    selection: "rgba(34,197,94,0.2)",
  },
  emerald: {
    "50": "#ecfdf5",
    "100": "#d1fae5",
    "500": "#10b981",
    "600": "#059669",
    glow: "rgba(16,185,129,0.35)",
    glowStrong: "rgba(16,185,129,0.5)",
    selection: "rgba(16,185,129,0.2)",
  },
  teal: {
    "50": "#f0fdfa",
    "100": "#ccfbf1",
    "500": "#14b8a6",
    "600": "#0d9488",
    glow: "rgba(20,184,166,0.35)",
    glowStrong: "rgba(20,184,166,0.5)",
    selection: "rgba(20,184,166,0.2)",
  },
  cyan: {
    "50": "#ecfeff",
    "100": "#cffafe",
    "500": "#06b6d4",
    "600": "#0891b2",
    glow: "rgba(6,182,212,0.35)",
    glowStrong: "rgba(6,182,212,0.5)",
    selection: "rgba(6,182,212,0.2)",
  },
  sky: {
    "50": "#f0f9ff",
    "100": "#e0f2fe",
    "500": "#0ea5e9",
    "600": "#0284c7",
    glow: "rgba(14,165,233,0.35)",
    glowStrong: "rgba(14,165,233,0.5)",
    selection: "rgba(14,165,233,0.2)",
  },
};

const RADIUS_MAP: Record<string, string> = {
  none: "0",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const accent = siteConfig.design.accent;
  const palette = ACCENT_COLORS[accent] ?? ACCENT_COLORS.blue;
  const radius = RADIUS_MAP[siteConfig.design.radius] ?? RADIUS_MAP.xl;

  const cssVars = {
    "--accent-50": palette["50"],
    "--accent-100": palette["100"],
    "--accent-500": palette["500"],
    "--accent-600": palette["600"],
    "--accent-glow": palette.glow,
    "--accent-glow-strong": palette.glowStrong,
    "--accent-selection": palette.selection,
    "--radius": radius,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      style={cssVars}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased font-sans bg-white text-gray-900 overflow-x-hidden">
        {children}
        <p className="fixed bottom-2 left-0 right-0 text-center text-[10px] text-gray-300 pointer-events-none select-none z-[55]">
          This is an early concept validation page
        </p>
      </body>
    </html>
  );
}
