import Link from "next/link";
import { getPosts, readingTime } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing from Felipe Mejia on AI ads, product-led growth, experimentation, attribution, and product execution.",
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <section className="section">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-accent2">Blog</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Field Notes</h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Notes on building AI-enabled products, growth systems, and operating rhythms that make the work measurable.
        </p>
      </div>

      <div className="mt-14">
        {posts.map((post) => (
          <article className="border-t border-white/10 py-8" key={post.slug}>
            <h2 className="text-2xl font-semibold text-white">
              <Link className="transition hover:text-accent" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              {post.date} · {readingTime(post.content)} min read
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-gray-300">{post.excerpt}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span className="text-sm text-accent2" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
