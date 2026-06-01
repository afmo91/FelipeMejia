import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cvDir = path.join(root, "data/cv");
const tweaksDir = path.join(cvDir, "tweaks");
const base = JSON.parse(fs.readFileSync(path.join(cvDir, "base.json"), "utf8"));
const issues = [];

function checkText(label, text, limit = 180) {
  if (!text || typeof text !== "string") {
    issues.push(`${label}: missing text`);
    return;
  }

  if (text.length > limit) {
    issues.push(`${label}: ${text.length} chars, keep it under ${limit}`);
  }

  if (/\s{2,}/.test(text)) {
    issues.push(`${label}: contains double spaces`);
  }
}

base.summary.forEach((line, index) => checkText(`summary[${index}]`, line, 360));
base.experience.forEach((item) => {
  checkText(`${item.company} role`, item.role, 90);
  item.bullets.forEach((bullet, index) => checkText(`${item.company} bullet[${index}]`, bullet, 260));
});

fs.readdirSync(tweaksDir)
  .filter((file) => file.endsWith(".json"))
  .forEach((file) => {
    const tweak = JSON.parse(fs.readFileSync(path.join(tweaksDir, file), "utf8"));
    checkText(`${file} title`, tweak.title, 90);
    (tweak.summaryAdditions || []).forEach((line, index) =>
      checkText(`${file} summaryAdditions[${index}]`, line, 190),
    );
  });

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log("CV content lint passed.");
