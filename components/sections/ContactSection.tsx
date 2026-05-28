import ContactForm from "@/components/ContactForm";
import { getBaseCV } from "@/lib/cv";

export default function ContactSection() {
  const { contact } = getBaseCV();

  return (
    <section className="section scroll-mt-24" id="contact">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Contact</p>
            <h2 className="section-title">Have a product, funnel, or AI workflow that needs clarity?</h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Send a short note about what you are trying to ship, fix, or measure. I usually help with 0→1 product definition, growth experimentation, onboarding, attribution, and operating cadence.
            </p>
            <p className="mt-6 text-sm text-gray-400">
              Prefer email? The direct link stays in the footer: {contact.email}.
            </p>
          </div>

          <div className="contact-panel">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
