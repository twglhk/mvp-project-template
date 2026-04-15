"use client";

import { siteConfig } from "@/lib/config";
import { tArray } from "@/lib/i18n";

export default function Story() {
  const paragraphs = tArray(siteConfig.story);

  return (
    <section className="bg-[#f9fafb] py-24 lg:py-32 px-6">
      <div className="reveal max-w-5xl mx-auto text-left">
        {paragraphs.map((text, i) => (
          i === 0 ? (
            <p
              key={i}
              className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 leading-[1.6] mb-8 whitespace-pre-line"
            >
              {text}
            </p>
          ) : (
            <p
              key={i}
              className="text-lg text-gray-500 leading-relaxed mb-4 whitespace-pre-line"
            >
              {text}
            </p>
          )
        ))}
      </div>
    </section>
  );
}
