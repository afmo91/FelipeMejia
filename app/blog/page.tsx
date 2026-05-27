import Link from "next/link";
import { getPosts } from "@/lib/content";

export default function BlogPage(){const posts=getPosts();return <section className="section"><h1 className="text-4xl font-semibold">Blog</h1><div className="mt-8 space-y-8">{posts.map((p)=><article key={p.slug}><h2 className="text-2xl"><Link href={`/blog/${p.slug}`}>{p.title}</Link></h2><p className="text-sm text-gray-400">{p.date} · {Math.ceil(p.content.split(/\s+/).length/200)} min read</p><p className="mt-2 text-gray-300">{p.excerpt}</p></article>)}</div></section>;}
