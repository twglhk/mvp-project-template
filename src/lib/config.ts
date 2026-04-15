// ============================================================================
// Site Configuration — Forge's ONLY content target
// ============================================================================
// Forge agent modifies ONLY this file when initializing a new project.
// All components read from this config. Do not scatter content across .tsx files.
// ============================================================================

export interface BilingualText {
  en: string;
  ko: string;
}

export interface Feature {
  label: BilingualText;
  title: BilingualText;
  description: BilingualText;
  imageUrl?: string;
}

export interface SurveyQuestion {
  question: BilingualText;
  choices?: BilingualText[];
  scaleLow?: BilingualText;
  scaleHigh?: BilingualText;
}

export interface SiteConfig {
  projectSlug: string;
  meta: {
    title: string;
    description: string;
  };
  headline: BilingualText;
  subheadline: BilingualText;
  story: {
    en: string[];
    ko: string[];
  };
  features: Feature[];
  cta: {
    text: BilingualText;
    heading: BilingualText;
    subtitle: BilingualText;
  };
  survey: {
    q1: SurveyQuestion;
    q2: SurveyQuestion;
    q3: SurveyQuestion;
  };
  design: {
    accent: string;
    radius: string;
  };
  logoText?: string;
  logoUrl?: string;
}

export const siteConfig: SiteConfig = {
  projectSlug: "mvp-landing",

  meta: {
    title: "MVP Landing — Validate Your Idea",
    description: "Describe your problem and we'll build a solution.",
  },

  headline: {
    en: "Validate ideas\nbefore you build",
    ko: "만들기 전에\n아이디어를 검증하세요",
  },

  subheadline: {
    en: "Stop guessing. Start with real user feedback.",
    ko: "추측을 멈추세요. 실제 사용자 피드백으로 시작하세요.",
  },

  story: {
    en: [
      "You have a product idea. Maybe you've been thinking about it for weeks, or maybe it just hit you this morning.",
      "But here's the problem — you have no idea if anyone actually wants it. You could spend months building, only to find out nobody cares.",
    ],
    ko: [
      "제품 아이디어가 있으시군요. 몇 주째 고민했을 수도 있고, 오늘 아침에 떠올랐을 수도 있습니다.",
      "문제는 — 실제로 누군가 원하는지 알 수 없다는 것입니다. 몇 달을 개발한 뒤에야 아무도 관심 없다는 걸 알게 될 수도 있습니다.",
    ],
  },

  features: [
    {
      label: { en: "Discovery", ko: "발견" },
      title: { en: "Find the problems\nthat matter most", ko: "가장 중요한 문제를\n찾아내세요" },
      description: {
        en: "Surface real pain points from thousands of conversations.",
        ko: "수천 건의 대화에서 실제 페인포인트를 찾아냅니다.",
      },
    },
    {
      label: { en: "Validation", ko: "검증" },
      title: { en: "Validate before\nyou build", ko: "만들기 전에\n검증하세요" },
      description: {
        en: "Test demand with real users, not assumptions.",
        ko: "가정이 아닌 실제 사용자로 수요를 테스트합니다.",
      },
    },
  ],

  cta: {
    text: { en: "Start for free", ko: "무료로 시작하기" },
    heading: { en: "Don't wait", ko: "기다리지 마세요" },
    subtitle: {
      en: "Be among the first to try it.",
      ko: "가장 먼저 사용해보세요.",
    },
  },

  survey: {
    q1: {
      question: {
        en: "What's your biggest challenge right now?",
        ko: "현재 가장 큰 어려움은 무엇인가요?",
      },
      choices: [
        { en: "Finding the right tool", ko: "적합한 도구 찾기" },
        { en: "Too many manual steps", ko: "수동 작업이 너무 많음" },
        { en: "Lack of reliable data", ko: "신뢰할 수 있는 데이터 부족" },
        { en: "Other", ko: "기타" },
      ],
    },
    q2: {
      question: {
        en: "How are you currently solving this problem?",
        ko: "현재 이 문제를 어떻게 해결하고 계신가요?",
      },
    },
    q3: {
      question: {
        en: "How much does this problem affect your daily work?",
        ko: "이 문제가 일상 업무에 얼마나 영향을 미치나요?",
      },
      scaleLow: { en: "Rarely", ko: "거의 없음" },
      scaleHigh: { en: "Very much", ko: "매우 큼" },
    },
  },

  design: {
    accent: "blue",
    radius: "xl",
  },
};
