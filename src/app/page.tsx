"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Features from "@/components/Features";
import BottomCTA from "@/components/BottomCTA";
import SurveyModal from "@/components/SurveyModal";
import ThankYouModal from "@/components/ThankYouModal";

type SurveyAnswer = { question: string; answer: string };

export default function Page() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleEmailSubmit = async (email: string) => {
    const { supabase, PROJECT_SLUG } = await import("@/lib/supabase");
    const leadId = crypto.randomUUID();
    const { error } = await supabase.from("leads").insert({
      id: leadId,
      email,
      landing_page_id: PROJECT_SLUG,
    });
    if (error) throw error;
    setCurrentLeadId(leadId);
    setShowSurvey(true);
  };

  const handleSurveyComplete = async (answers: SurveyAnswer[]) => {
    if (!currentLeadId) return;
    const { supabase } = await import("@/lib/supabase");
    const rows = answers.map((a) => ({
      lead_id: currentLeadId,
      question: a.question,
      answer: a.answer,
    }));
    const { error } = await supabase.from("survey_responses").insert(rows);
    if (error) throw error;
    setShowSurvey(false);
    setShowThankYou(true);
  };

  return (
    <>
      <Hero onEmailSubmit={handleEmailSubmit} />
      <Story />
      <Features />
      <BottomCTA />
      <SurveyModal
        isOpen={showSurvey}
        onClose={() => setShowSurvey(false)}
        onComplete={handleSurveyComplete}
      />
      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
      />
    </>
  );
}
