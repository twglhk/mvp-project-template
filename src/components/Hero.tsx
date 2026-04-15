"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { t } from "@/lib/i18n";

interface HeroProps {
  onEmailSubmit: (email: string) => Promise<void>;
}

export default function Hero({ onEmailSubmit }: HeroProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setError("");
    setIsSubmitting(true);
    try {
      await onEmailSubmit(trimmed);
    } catch {
      setError(
        t({ en: "Registration failed. Please try again.", ko: "등록에 실패했습니다. 다시 시도해주세요." })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 px-6 bg-gradient-to-b from-white to-[#f9fafb]"
    >
      {(siteConfig.logoText || siteConfig.logoUrl) && (
        <div className="absolute top-6 left-6">
          {siteConfig.logoUrl ? (
            <Image
              src={siteConfig.logoUrl}
              alt={siteConfig.logoText ?? "Logo"}
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span className="font-bold text-gray-900 text-xl">
              {siteConfig.logoText}
            </span>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 whitespace-pre-line reveal">
          {t(siteConfig.headline)}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl font-normal text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto whitespace-pre-line reveal reveal-delay-1">
          {t(siteConfig.subheadline)}
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto reveal reveal-delay-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            className="accent-focus flex-1 bg-white border border-gray-200 rounded-[var(--radius)] px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 transition-all shadow-sm min-w-0"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="cta-accent bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-semibold text-base rounded-[var(--radius)] px-8 py-3.5 transition-all whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "..." : t(siteConfig.cta.text)}
          </button>
        </form>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <p className="mt-5 text-xs text-gray-400 reveal reveal-delay-3">
          {t({ en: "No spam. Unsubscribe anytime.", ko: "스팸 없음. 언제든지 구독 취소 가능합니다." })}
        </p>
      </div>

      <div className="mt-16 sm:mt-20 max-w-4xl mx-auto reveal">
        <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
          <span className="text-gray-300 text-sm font-medium">Product preview</span>
        </div>
      </div>
    </section>
  );
}
