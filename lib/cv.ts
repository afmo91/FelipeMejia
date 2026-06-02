import fs from "fs";
import path from "path";

const cvDir = path.join(process.cwd(), "data/cv");
const tweaksDir = path.join(cvDir, "tweaks");
const versionsDir = path.join(cvDir, "versions");
const publicCVFile = path.join(cvDir, "public.json");
const baseCVFile = path.join(cvDir, "base.json");

export type ContactLink = {
  label: string;
  url: string;
};

export type CVContact = {
  email: string;
  linkedin: ContactLink;
  github: ContactLink;
};

export type CVExperience = {
  company: string;
  role: string;
  caseStudyHref: string;
  metrics: string[];
  bullets: string[];
};

export type BaseCV = {
  name: string;
  title: string;
  summary: string[];
  contact: CVContact;
  experience: CVExperience[];
  selectedAchievements?: string[];
  skills: Record<string, string[]>;
  tools?: string[];
  languages?: string[];
  education?: string[];
};

export type CVTweak = {
  slug: string;
  title: string;
  application: string;
  summaryAdditions?: string[];
  skillAdditions?: Record<string, string[]>;
  skillRemovals?: Record<string, string[]>;
  highlightOrder?: Record<string, string[]>;
};

export type CombinedCV = BaseCV & {
  slug: string;
  application?: string;
  isBase: boolean;
};

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function reorderBullets(bullets: string[], preferred: string[] = []) {
  const preferredSet = new Set(preferred);
  return [
    ...preferred.filter((bullet) => bullets.includes(bullet)),
    ...bullets.filter((bullet) => !preferredSet.has(bullet)),
  ];
}

export function getBaseCV(): BaseCV {
  return readJson<BaseCV>(fs.existsSync(publicCVFile) ? publicCVFile : baseCVFile);
}

export function getCVTweaks(): CVTweak[] {
  const sources = [versionsDir, tweaksDir].filter((dir) => fs.existsSync(dir));

  return sources
    .flatMap((dir) =>
      fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => readJson<CVTweak>(path.join(dir, file))),
    )
    .filter((tweak, index, all) => all.findIndex((item) => item.slug === tweak.slug) === index)
    .sort((a, b) => a.application.localeCompare(b.application));
}

export function getCVTweak(slug: string) {
  return getCVTweaks().find((tweak) => tweak.slug === slug) || null;
}

export function combineCV(base: BaseCV, tweak?: CVTweak | null): CombinedCV {
  if (!tweak) {
    return {
      ...base,
      slug: "base",
      isBase: true,
    };
  }

  const skills = Object.fromEntries(
    Object.entries(base.skills).map(([group, values]) => [group, [...values]]),
  ) as Record<string, string[]>;

  Object.entries(tweak.skillAdditions || {}).forEach(([group, values]) => {
    skills[group] = unique([...(skills[group] || []), ...values]);
  });

  Object.entries(tweak.skillRemovals || {}).forEach(([group, values]) => {
    const removals = new Set(values);
    skills[group] = (skills[group] || []).filter((skill) => !removals.has(skill));
  });

  return {
    ...base,
    application: tweak.application,
    experience: base.experience.map((item) => ({
      ...item,
      bullets: reorderBullets(item.bullets, tweak.highlightOrder?.[item.company]),
    })),
    isBase: false,
    skills,
    slug: tweak.slug,
    summary: [...base.summary, ...(tweak.summaryAdditions || [])],
    title: tweak.title,
  };
}

export function getCombinedCVs() {
  const base = getBaseCV();
  return getCVTweaks().map((tweak) => combineCV(base, tweak));
}

export function getCombinedCV(slug: string) {
  if (slug === "base") {
    return combineCV(getBaseCV());
  }

  const base = getBaseCV();
  const tweak = getCVTweak(slug);
  return tweak ? combineCV(base, tweak) : null;
}
