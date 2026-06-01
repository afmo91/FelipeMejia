import fs from "node:fs";
import path from "node:path";
import React from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from "@react-pdf/renderer";

const root = process.cwd();
const cvDir = path.join(root, "data/cv");
const tweaksDir = path.join(cvDir, "tweaks");
const versionsDir = path.join(cvDir, "versions");
const outputDir = path.join(root, "public/cv");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function unique(items) {
  return Array.from(new Set(items));
}

function reorderBullets(bullets, preferred = []) {
  const preferredSet = new Set(preferred);
  return [
    ...preferred.filter((bullet) => bullets.includes(bullet)),
    ...bullets.filter((bullet) => !preferredSet.has(bullet)),
  ];
}

function combineCV(base, tweak) {
  const skills = Object.fromEntries(
    Object.entries(base.skills).map(([group, values]) => [group, [...values]]),
  );

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
    skills,
    slug: tweak.slug,
    summary: [...base.summary, ...(tweak.summaryAdditions || [])],
    title: tweak.title,
  };
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#09090f",
    color: "#f7f7fb",
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.45,
    padding: 36,
  },
  header: {
    borderBottomColor: "#8b5cf6",
    borderBottomWidth: 1.5,
    marginBottom: 18,
    paddingBottom: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0,
  },
  title: {
    color: "#a78bfa",
    fontSize: 12,
    marginTop: 5,
  },
  contact: {
    color: "#cbd5e1",
    fontSize: 8.5,
    marginTop: 8,
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    color: "#67e8f9",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  summaryLine: {
    color: "#e5e7eb",
    marginBottom: 3,
  },
  role: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 3,
  },
  metric: {
    color: "#c4b5fd",
    fontSize: 8.5,
    marginBottom: 5,
  },
  bullet: {
    color: "#e5e7eb",
    marginBottom: 3,
  },
  skillGroup: {
    marginBottom: 5,
  },
  skillTitle: {
    color: "#f7f7fb",
    fontWeight: 700,
  },
  skillText: {
    color: "#cbd5e1",
  },
});

function CVDocument({ cv }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.name }, cv.name),
        React.createElement(Text, { style: styles.title }, cv.title),
        React.createElement(
          Text,
          { style: styles.contact },
          `${cv.contact.email}  |  ${cv.contact.linkedin.url}  |  ${cv.contact.github.url}`,
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Summary"),
        cv.summary.map((line) => React.createElement(Text, { key: line, style: styles.summaryLine }, line)),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Experience"),
        cv.experience.map((item) =>
          React.createElement(
            View,
            { key: item.company, style: { marginBottom: 10 } },
            React.createElement(Text, { style: styles.role }, `${item.company} — ${item.role}`),
            React.createElement(Text, { style: styles.metric }, item.metrics.join("  |  ")),
            item.bullets.map((bullet) => React.createElement(Text, { key: bullet, style: styles.bullet }, `• ${bullet}`)),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Core Skills"),
        Object.entries(cv.skills).map(([group, values]) =>
          React.createElement(
            View,
            { key: group, style: styles.skillGroup },
            React.createElement(Text, { style: styles.skillText },
              React.createElement(Text, { style: styles.skillTitle }, `${group}: `),
              values.join(", "),
            ),
          ),
        ),
      ),
    ),
  );
}

fs.mkdirSync(outputDir, { recursive: true });

const publicCVFile = path.join(cvDir, "public.json");
const base = readJson(fs.existsSync(publicCVFile) ? publicCVFile : path.join(cvDir, "base.json"));
const tweakSources = [versionsDir, tweaksDir].filter((dir) => fs.existsSync(dir));
const tweaks = tweakSources
  .flatMap((dir) =>
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => readJson(path.join(dir, file))),
  )
  .filter((tweak, index, all) => all.findIndex((item) => item.slug === tweak.slug) === index);

await renderToFile(React.createElement(CVDocument, { cv: base }), path.join(outputDir, "felipe-mejia-public-cv.pdf"));
console.log("Generated public/cv/felipe-mejia-public-cv.pdf");

for (const tweak of tweaks) {
  const cv = combineCV(base, tweak);
  const output = path.join(outputDir, `${cv.slug}.pdf`);
  await renderToFile(React.createElement(CVDocument, { cv }), output);
  console.log(`Generated ${path.relative(root, output)}`);
}
