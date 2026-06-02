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
    backgroundColor: "#ffffff",
    color: "#111827",
    fontFamily: "Helvetica",
    fontSize: 9.25,
    lineHeight: 1.34,
    paddingBottom: 34,
    paddingHorizontal: 38,
    paddingTop: 34,
  },
  header: {
    borderBottomColor: "#d1d5db",
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingBottom: 10,
  },
  name: {
    color: "#111827",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0,
  },
  title: {
    color: "#374151",
    fontSize: 11,
    marginTop: 4,
  },
  contact: {
    color: "#4b5563",
    fontSize: 8,
    marginTop: 6,
  },
  section: {
    marginTop: 9,
  },
  sectionTitle: {
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 0.75,
    color: "#111827",
    fontSize: 9.75,
    fontWeight: 700,
    letterSpacing: 0.7,
    marginBottom: 5,
    paddingBottom: 2.5,
    textTransform: "uppercase",
  },
  summaryLine: {
    color: "#1f2937",
    marginBottom: 2,
  },
  roleBlock: {
    marginBottom: 8,
  },
  roleHeader: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  role: {
    color: "#111827",
    fontSize: 10.25,
    fontWeight: 700,
    marginBottom: 2,
    maxWidth: "68%",
  },
  metric: {
    color: "#4b5563",
    fontSize: 7.6,
    marginBottom: 3,
  },
  metricRight: {
    color: "#4b5563",
    fontSize: 7.4,
    maxWidth: "30%",
    textAlign: "right",
  },
  bulletRow: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 2,
  },
  bulletMarker: {
    color: "#111827",
    fontSize: 8,
    width: 6,
  },
  bullet: {
    color: "#1f2937",
    flex: 1,
  },
  skillGroup: {
    marginBottom: 3.5,
  },
  skillTitle: {
    color: "#111827",
    fontWeight: 700,
  },
  skillText: {
    color: "#1f2937",
  },
  compactText: {
    color: "#1f2937",
    marginBottom: 2,
  },
  columns: {
    flexDirection: "row",
    gap: 14,
  },
  column: {
    flex: 1,
  },
});

function CVDocument({ cv }) {
  const education = cv.education?.length ? cv.education : ["Details available on request."];

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
            { key: item.company, style: styles.roleBlock },
            React.createElement(
              View,
              { style: styles.roleHeader },
              React.createElement(Text, { style: styles.role }, `${item.company} - ${item.role}`),
              React.createElement(Text, { style: styles.metricRight }, item.metrics.slice(0, 3).join(" | ")),
            ),
            item.metrics.length > 3
              ? React.createElement(Text, { style: styles.metric }, item.metrics.slice(3).join(" | "))
              : null,
            item.bullets.map((bullet) =>
              React.createElement(
                View,
                { key: bullet, style: styles.bulletRow },
                React.createElement(Text, { style: styles.bulletMarker }, "-"),
                React.createElement(Text, { style: styles.bullet }, bullet),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Selected Achievements"),
        (cv.selectedAchievements || []).map((achievement) =>
          React.createElement(
            View,
            { key: achievement, style: styles.bulletRow },
            React.createElement(Text, { style: styles.bulletMarker }, "-"),
            React.createElement(Text, { style: styles.bullet }, achievement),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: [styles.section, styles.columns] },
        React.createElement(
          View,
          { style: styles.column },
          React.createElement(Text, { style: styles.sectionTitle }, "Skills"),
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
        React.createElement(
          View,
          { style: styles.column },
          React.createElement(Text, { style: styles.sectionTitle }, "Tools"),
          React.createElement(Text, { style: styles.compactText }, (cv.tools || []).join(", ")),
          React.createElement(View, { style: { marginTop: 7 } }),
          React.createElement(Text, { style: styles.sectionTitle }, "Languages"),
          (cv.languages || []).map((language) => React.createElement(Text, { key: language, style: styles.compactText }, language)),
          React.createElement(View, { style: { marginTop: 7 } }),
          React.createElement(Text, { style: styles.sectionTitle }, "Education"),
          education.map((item) => React.createElement(Text, { key: item, style: styles.compactText }, item)),
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
