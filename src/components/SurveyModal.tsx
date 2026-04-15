"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "@/lib/config";
import { t, isKorean } from "@/lib/i18n";

type SurveyAnswer = { question: string; answer: string };

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: SurveyAnswer[]) => Promise<void>;
}

const TOTAL_STEPS = 3;

export default function SurveyModal({
  isOpen,
  onClose,
  onComplete,
}: SurveyModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [q2Value, setQ2Value] = useState("");
  const [q3Selected, setQ3Selected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setAnswers([]);
      setQ1Selected(null);
      setQ2Value("");
      setQ3Selected(null);
      setIsSubmitting(false);
      setSubmitError("");
    }
  }, [isOpen]);

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
  const { q1, q2, q3 } = siteConfig.survey;

  const progressWidth = `${((step + 1) / TOTAL_STEPS) * 100}%`;

  const handleQ1Next = () => {
    if (!q1Selected) return;
    setAnswers([{ question: t(q1.question), answer: q1Selected }]);
    setStep(1);
  };

  const handleQ2Next = (value: string) => {
    setAnswers((prev) => [
      ...prev,
      { question: t(q2.question), answer: value },
    ]);
    setStep(2);
  };

  const handleQ3Submit = async () => {
    if (!q3Selected) return;
    const finalAnswers = [
      ...answers,
      { question: t(q3.question), answer: q3Selected },
    ];
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await onComplete(finalAnswers);
    } catch {
      setSubmitError(
        ko ? "제출에 실패했습니다." : "Submission failed. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
              <span>
                {step + 1} / {TOTAL_STEPS}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="h-1 w-full rounded-full bg-gray-200">
              <div
                className="h-1 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: progressWidth,
                  backgroundColor: "var(--accent-500)",
                }}
              />
            </div>
          </div>

          <div className="min-h-[240px]">
            {step === 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                  {t(q1.question)}
                </h3>
                <div className="space-y-3">
                  {q1.choices?.map((choice, i) => {
                    const label = t(choice);
                    const isSelected = q1Selected === label;
                    return (
                      <button
                        key={i}
                        onClick={() => setQ1Selected(label)}
                        className="w-full text-left p-4 rounded-xl border-2 transition-colors"
                        style={{
                          borderColor: isSelected
                            ? "var(--accent-500)"
                            : "#e5e7eb",
                          backgroundColor: isSelected
                            ? "var(--accent-50)"
                            : "transparent",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                  {t(q2.question)}
                </h3>
                <textarea
                  rows={4}
                  value={q2Value}
                  onChange={(e) => setQ2Value(e.target.value)}
                  className="accent-focus w-full rounded-xl border border-gray-300 px-4 py-3 text-base shadow-sm outline-none transition-colors resize-none"
                  placeholder=""
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                  {t(q3.question)}
                </h3>
                <div className="flex justify-center gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const val = String(n);
                    const isSelected = q3Selected === val;
                    return (
                      <button
                        key={n}
                        onClick={() => setQ3Selected(val)}
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors"
                        style={{
                          borderColor: isSelected
                            ? "var(--accent-500)"
                            : "#d1d5db",
                          backgroundColor: isSelected
                            ? "var(--accent-500)"
                            : "transparent",
                          color: isSelected ? "#fff" : "#4b5563",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>{q3.scaleLow ? t(q3.scaleLow) : (ko ? "거의 없음" : "Rarely")}</span>
                  <span>{q3.scaleHigh ? t(q3.scaleHigh) : (ko ? "매우 큼" : "Very much")}</span>
                </div>
                {submitError && (
                  <p className="mt-4 text-sm text-red-600">{submitError}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            {step === 1 ? (
              <button
                onClick={() => handleQ2Next("")}
                className="text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
              >
                {ko ? "건너뛰기" : "Skip"}
              </button>
            ) : (
              <span />
            )}

            {step === 0 && (
              <button
                onClick={handleQ1Next}
                disabled={!q1Selected}
                className="ml-auto rounded-[var(--radius)] px-8 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--accent-500)" }}
              >
                {ko ? "다음" : "Next"}
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => handleQ2Next(q2Value.trim())}
                className="ml-auto rounded-[var(--radius)] px-8 py-3 text-sm font-bold text-white shadow-md transition-all"
                style={{ backgroundColor: "var(--accent-500)" }}
              >
                {ko ? "다음" : "Next"}
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleQ3Submit}
                disabled={!q3Selected || isSubmitting}
                className="ml-auto rounded-[var(--radius)] px-8 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--accent-500)" }}
              >
                {isSubmitting ? "..." : (ko ? "제출하기" : "Submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
