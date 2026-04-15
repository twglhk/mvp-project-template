"use client";

import { siteConfig } from "@/lib/config";
import { t } from "@/lib/i18n";

export default function BottomCTA() {
  return (
    <section className="bg-[#f9fafb] border-t border-gray-100 py-24 lg:py-32 px-6">
      <div className="reveal relative max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-4 whitespace-pre-line">
          {t(siteConfig.cta.heading)}
        </h2>
        <p className="text-base sm:text-lg text-gray-500 mb-10">
          {t(siteConfig.cta.subtitle)}
        </p>
        <a
          href="#hero"
          className="cta-accent inline-block bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white font-semibold text-base rounded-[var(--radius)] px-8 py-3.5 transition-all"
        >
          {t(siteConfig.cta.text)}
        </a>
        <div className="mt-8">
          <a
            href="#hero"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ↑ Back to top
          </a>
        </div>
      </div>
    </section>
  );
}
