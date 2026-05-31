#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "audio");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

const MESSAGES = [
  ["welcome", "Hi, I'm Felipe — product builder, growth operator, AI systems designer. Want me to walk you through what I do?"],
  ["intro", "What brings you here?"],
  ["specialise", "I specialise in AI-enabled products, growth systems, and analytics loops that turn messy signals into shipped decisions."],
  ["hiring", "I've led AI-enabled products from idea to launch. Would you like to see results, process, or roles I've played?"],
  ["hiring_results", "Results: same-day activation from a five-day process, plus 25 percent conversion, minus 30 percent CAC, and over 200 thousand euros recovered through attribution."],
  ["hiring_ai", "At Spotz.pro, I built a multi-channel AI ads operating layer across Google, Meta, LinkedIn, TikTok, X, and Pinterest."],
  ["hiring_process", "My process is simple: clarify the decision, instrument the signal, ship the smallest useful product, then iterate with the metrics in view."],
  ["consulting", "I help teams turn fuzzy AI, growth, or analytics problems into concrete workflows and product releases."],
  ["consulting_results", "The work usually lands as faster activation, cleaner attribution, sharper experiments, or an AI workflow that removes manual review from the critical path."],
  ["consulting_ai", "Typical builds include workflow triage, campaign intelligence, attribution dashboards, and copilots that surface exceptions before teams miss them."],
  ["consulting_process", "I usually start with a clarity sprint, map the current operating loop, then build a thin version that proves the highest-risk assumption."],
  ["exploring", "Start with the through-line: telecom, SaaS, e-commerce, and AI work where product judgment had to meet commercial pressure."],
  ["exploring_story", "I've spent more than 12 years connecting growth pressure, customer behavior, and product delivery — usually where teams need clarity more than ceremony."],
  ["exploring_work", "The highlights: an AI ads platform, same-day onboarding, over 200 thousand euros recovered through attribution, and an experimentation cadence that lifted conversion 25 percent."],
  ["exploring_process", "I work by making the messy thing visible: map the loop, find the missing signal, ship a useful slice, and keep the team close to the evidence."],
  ["connect", "Yes — the easiest path is email or LinkedIn. Email me at felipe dot mejia at spotz dot pro, or connect on LinkedIn."],
  ["cv", "The CV page has the current structured version. Use it as a quick scan, then reach out if a specific role or project fits."],
];

if (!API_KEY || !VOICE_ID) {
  console.error("Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID.");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

async function generateAudio(state, text) {
  const filename = `message-${state}.mp3`;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.48,
        similarity_boost: 0.78,
        style: 0.12,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${filename}: ElevenLabs ${response.status} ${body}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(join(OUT_DIR, filename), buffer);
  console.log(`Saved ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

for (const [state, text] of MESSAGES) {
  await generateAudio(state, text);
  await new Promise((resolve) => setTimeout(resolve, 350));
}
