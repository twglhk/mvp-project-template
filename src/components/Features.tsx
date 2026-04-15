"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { t } from "@/lib/i18n";

export default function Features() {
  const features = siteConfig.features;
  if (!features.length) return null;

  return (
    <section className="bg-white py-24 lg:py-32 px-6">
      <div className="max-w-5xl mx-auto space-y-24 lg:space-y-32">
        {features.map((feature, index) => (
          <div
            key={index}
            data-feature={index}
            className={`reveal flex flex-col gap-12 lg:gap-16 items-center ${
              index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
            }`}
          >
            <div className="flex-1 w-full">
              <span
                className="feat-label text-sm font-semibold tracking-widest uppercase"
                style={{ color: "var(--accent-500)" }}
              >
                {t(feature.label)}
              </span>
              <h2 className="feat-title text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4 whitespace-pre-line">
                {t(feature.title)}
              </h2>
              <p className="feat-desc text-lg text-gray-500 leading-relaxed">
                {t(feature.description)}
              </p>
            </div>

            <div className="flex-1 w-full">
              {feature.imageUrl ? (
                <Image
                  src={feature.imageUrl}
                  alt={t(feature.title)}
                  width={600}
                  height={400}
                  className="w-full rounded-2xl shadow-lg object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-300 text-sm font-medium">
                    Feature image
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
