import { notFound } from "next/navigation";
import { getCV } from "@/lib/content";

export default function CVPage({ params }: { params: { slug: string } }) {const cv=getCV(params.slug);if(!cv) return notFound();return <section className="section"><h1 className="text-4xl">{cv.title}</h1><p className="mt-4 text-gray-300">{cv.summary}</p><h2 className="mt-8 text-2xl">Experience</h2>{cv.experience.map((e)=> <article key={e.role} className="mt-4"><h3>{e.role} · {e.company}</h3><p className="text-sm text-gray-400">{e.period}</p><ul className="list-disc pl-6">{e.highlights.map((h)=><li key={h}>{h}</li>)}</ul></article>)}</section>;}
