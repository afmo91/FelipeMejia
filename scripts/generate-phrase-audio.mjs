#!/usr/bin/env node
/**
 * Pre-generates ElevenLabs audio for all 8 bust phrases + 3 A/B taglines.
 * Output: public/audio/phrase-{n}.mp3  (1-8)
 *         public/audio/tagline-{n}.mp3 (0-2)
 *
 * Usage:  node scripts/generate-phrase-audio.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "audio");

mkdirSync(OUT_DIR, { recursive: true });

const API_KEY = process.env.ELEVENLABS_API_KEY || "sk_82e2f71a839ccc2d96a692ca908ae3a3992178850889bc7e";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "uOvF0TBLNwHJZBJFdIgT";

const PHRASE_TEXTS = [
  "Product and Growth Leader. 12 plus years delivering AI-enabled platforms and measurable business impact.",
  "Zero to one product builder. Turning complex data into clear decisions that drive customer growth.",
  "Trusted by telecoms, SaaS and e-commerce companies. Designing, launching and scaling high-impact digital products.",
  "Multi-channel growth expert. Reducing customer acquisition cost and boosting conversion through marketing, analytics and product-led growth.",
  "From vision to execution. Bringing cross-functional teams together to deliver AI-powered solutions on time and on budget.",
  "Data-obsessed operator. Building observability, attribution and experimentation frameworks that drive continuous improvement.",
  "Creativity meets rigour. Mixing imagination and discipline to transform user insights into delightful products and profitable growth.",
  "Stakeholder trusted at every level. Partnering with teams to turn ideas into market-ready products and sustainable revenue streams.",
];

const TAGLINE_TEXTS = [
  "From chaos to clarity: building products that feel inevitable.",
  "Blending rigor and imagination to make complexity simple.",
  "Turning messy, real-world challenges into elegant, data-driven experiences.",
];

async function generateAudio(text, filename) {
  console.log(`Generating: ${filename}`);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
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
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ Failed (${res.status}): ${err}`);
    return;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = join(OUT_DIR, filename);
  writeFileSync(outPath, buffer);
  console.log(`  ✓ Saved ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log("ElevenLabs audio generation\n");

  for (let i = 0; i < PHRASE_TEXTS.length; i++) {
    await generateAudio(PHRASE_TEXTS[i], `phrase-${i + 1}.mp3`);
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 400));
  }

  for (let i = 0; i < TAGLINE_TEXTS.length; i++) {
    await generateAudio(TAGLINE_TEXTS[i], `tagline-${i}.mp3`);
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("\nDone. All audio files saved to public/audio/");
}

main().catch(console.error);
