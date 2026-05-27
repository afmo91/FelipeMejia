import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "data/blog");
const cvDir = path.join(process.cwd(), "data/cvs");

export type BlogPost = { slug: string; title: string; date: string; tags: string[]; excerpt: string; content: string };
export type CV = { slug: string; title: string; summary: string; experience: { role: string; company: string; period: string; highlights: string[] }[]; skills: string[]; tools: string[] };

export function getPosts(): BlogPost[] {
  return fs.readdirSync(blogDir).filter((f) => f.endsWith(".md")).map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    return { slug, title: data.title, date: data.date, tags: data.tags || [], excerpt: data.excerpt || "", content } as BlogPost;
  });
}

export function getPost(slug: string) { return getPosts().find((p) => p.slug === slug); }
export function getCV(slug: string): CV | null {
  const file = path.join(cvDir, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
