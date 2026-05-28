import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "data/blog");
const cvDir = path.join(process.cwd(), "data/cvs");

export type BlogPost = { slug: string; title: string; date: string; tags: string[]; excerpt: string; content: string };
export type CV = {
  slug: string;
  title: string;
  summary: string;
  experience: { role: string; company: string; bullets: string[] }[];
  skills: string[];
  tools: string[];
};

function createExcerpt(content: string) {
  const firstParagraph =
    content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .find((paragraph) => paragraph && !paragraph.startsWith("#")) || "";

  return firstParagraph
    .replace(/[*_`#[\]]/g, "")
    .replace(/\((.*?)\)/g, "")
    .slice(0, 180);
}

export function readingTime(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200));
}

export function getPosts(): BlogPost[] {
  return fs.readdirSync(blogDir).filter((f) => f.endsWith(".md")).map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      excerpt: data.excerpt || createExcerpt(content),
      content,
    } as BlogPost;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) { return getPosts().find((p) => p.slug === slug); }
export function getCVSlugs() {
  return fs.readdirSync(cvDir).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, ""));
}
export function getCV(slug: string): CV | null {
  const file = path.join(cvDir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return { slug, ...JSON.parse(fs.readFileSync(file, "utf8")) };
}
