"use client";

import { useEffect } from "react";
import { isKorean } from "@/lib/i18n";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const ko = isKorean();

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: "var(--accent-50)" }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: "var(--accent-500)" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {ko ? "등록 완료" : "Registration complete"}
          </h2>
          <p className="mt-3 text-gray-500 leading-relaxed font-light">
            {ko
              ? "아직 제품은 없지만, 솔루션을 개발 중입니다."
              : "We don't have a product yet, but we're working on a solution."}
          </p>

          <ul className="mt-6 space-y-3 text-left">
            <li className="flex items-start gap-3 text-gray-600">
              <svg
                className="w-5 h-5 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-500)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                {ko
                  ? "베타가 준비되면 이메일로 알려드립니다."
                  : "We'll email you when the beta is ready."}
              </span>
            </li>
            <li className="flex items-start gap-3 text-gray-600">
              <svg
                className="w-5 h-5 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-500)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                {ko
                  ? "가장 먼저 사용해보실 수 있습니다."
                  : "You'll be among the first to try it."}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
