import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPost } from "@/lib/content";

export default function BlogPostPage({ params }: { params: { slug: string } }) {const post=getPost(params.slug);if(!post) return notFound();return <section className="section prose prose-invert max-w-4xl"><h1>{post.title}</h1><p>{post.date}</p><ReactMarkdown>{post.content}</ReactMarkdown></section>;}
