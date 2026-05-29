// All phrase content for the Signal experience

export type Phrase = {
  headline: string;
  subtitle: string;
  audioText: string; // full text spoken by ElevenLabs
};

export const PHRASES: Phrase[] = [
  {
    headline: "Product & Growth Leader",
    subtitle: "12+ years delivering AI-enabled platforms and measurable business impact",
    audioText:
      "Product and Growth Leader. 12 plus years delivering AI-enabled platforms and measurable business impact.",
  },
  {
    headline: "0→1 Product Builder",
    subtitle: "Turning complex data into clear decisions that drive customer growth",
    audioText:
      "Zero to one product builder. Turning complex data into clear decisions that drive customer growth.",
  },
  {
    headline: "Trusted by Telecoms, SaaS & E-commerce",
    subtitle: "Designing, launching and scaling high-impact digital products",
    audioText:
      "Trusted by telecoms, SaaS and e-commerce companies. Designing, launching and scaling high-impact digital products.",
  },
  {
    headline: "Multi-Channel Growth Expert",
    subtitle: "Reducing CAC and boosting conversion through marketing, analytics and PLG",
    audioText:
      "Multi-channel growth expert. Reducing customer acquisition cost and boosting conversion through marketing, analytics and product-led growth.",
  },
  {
    headline: "Vision to Execution",
    subtitle: "Cross-functional teams, AI-powered delivery, on time and on budget",
    audioText:
      "From vision to execution. Bringing cross-functional teams together to deliver AI-powered solutions on time and on budget.",
  },
  {
    headline: "Data-Obsessed Operator",
    subtitle: "Observability, attribution and experimentation frameworks that compound",
    audioText:
      "Data-obsessed operator. Building observability, attribution and experimentation frameworks that drive continuous improvement.",
  },
  {
    headline: "Creativity Meets Rigour",
    subtitle: "Transforming user insights into delightful products and profitable growth",
    audioText:
      "Creativity meets rigour. Mixing imagination and discipline to transform user insights into delightful products and profitable growth.",
  },
  {
    headline: "Stakeholder Trusted",
    subtitle: "From idea to market-ready product and sustainable revenue",
    audioText:
      "Stakeholder trusted at every level. Partnering with teams to turn ideas into market-ready products and sustainable revenue streams.",
  },
];

// A/B taglines for the opening screen (random per visitor)
export const AB_TAGLINES = [
  "From chaos to clarity: building products that feel inevitable.",
  "Blending rigor and imagination to make complexity simple.",
  "Turning messy, real-world challenges into elegant, data‑driven experiences.",
] as const;

export type ABVariant = 0 | 1 | 2;

export function getABVariant(): ABVariant {
  if (typeof window === "undefined") return 0;
  const stored = sessionStorage.getItem("ab-tagline");
  if (stored === "0" || stored === "1" || stored === "2") return Number(stored) as ABVariant;
  const variant = (Math.floor(Math.random() * 3)) as ABVariant;
  sessionStorage.setItem("ab-tagline", String(variant));
  return variant;
}

// Chat quick-start suggestions
export const CHAT_SUGGESTIONS = [
  "I'm hiring or evaluating",
  "I need a consultant or builder",
  "Just exploring",
] as const;

// Path types
export type PathType = "hiring" | "consulting" | "exploring";

export type ResolvedPath = {
  type: PathType;
  context: string;         // original user message
  emphasis: string[];      // AI-extracted emphasis points
  greeting: string;        // personalised greeting to show
  cvHint: string;          // for CV personalisation
};
