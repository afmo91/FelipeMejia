import AnimatedSection from "@/components/AnimatedSection";
import Portrait3D from "@/components/Portrait3D";

export default function HomePage() {
  return (
    <>
      <section className="section grid min-h-[70vh] items-center gap-8 md:grid-cols-2">
        <div><h1 className="text-5xl font-bold">Designing growth systems with AI</h1><p className="mt-6 text-lg text-gray-300">Product, growth, and strategy leadership for modern digital teams.</p></div>
        <Portrait3D />
      </section>
      <AnimatedSection><h2 className="text-3xl">What I Do</h2><p className="mt-4 max-w-3xl text-gray-300">I build scalable product and growth engines.</p></AnimatedSection>
    </>
  );
}
