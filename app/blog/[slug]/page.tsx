import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPost, getPosts, readingTime } from "@/lib/content";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);

  if (!post) {
    return {
      title: "Blog Post",
      description: "Blog post by Felipe Mejia.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <article className="section">
      <div className="max-w-4xl">
        <p className="text-sm text-accent2">
          {post.date} · {readingTime(post.content)} min read
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">{post.title}</h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span className="text-sm text-accent" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="prose prose-invert mt-12 max-w-4xl prose-headings:text-white prose-a:text-accent prose-strong:text-white">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
