import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBaseCV, getCombinedCVs } from "@/lib/cv";

export const metadata = { title: "Admin | Felipe Mejia" };

const cvDir = path.join(process.cwd(), "data/cv");
const publicCVPath = path.join(cvDir, "public.json");
const baseCVPath = path.join(cvDir, "base.json");
const versionsDir = path.join(cvDir, "versions");

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((line) => line.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");
  return session;
}

async function savePublicCV(formData: FormData) {
  "use server";

  await requireSession();
  const current = getBaseCV();
  const next = {
    ...current,
    languages: splitCommaList(getText(formData, "languages")),
    selectedAchievements: splitLines(getText(formData, "selectedAchievements")),
    summary: splitLines(getText(formData, "summary")),
    title: getText(formData, "title") || current.title,
    tools: splitCommaList(getText(formData, "tools")),
  };

  // Local JSON writes are useful for this MVP/admin workflow. Replace with database-backed CV storage before multi-user production editing.
  await fs.mkdir(cvDir, { recursive: true });
  const serialized = `${JSON.stringify(next, null, 2)}\n`;
  await fs.writeFile(publicCVPath, serialized, "utf8");
  await fs.writeFile(baseCVPath, serialized, "utf8");
  revalidatePath("/");
  revalidatePath("/cv");
  revalidatePath("/admin");
  redirect("/admin?saved=public");
}

async function createCVVersion(formData: FormData) {
  "use server";

  await requireSession();
  const title = getText(formData, "versionTitle");
  const application = getText(formData, "application");
  const slug = slugify(getText(formData, "slug") || title || application);

  if (!slug || !title || !application) {
    redirect("/admin?error=missing-version-fields");
  }

  const version = {
    application,
    slug,
    summaryAdditions: splitLines(getText(formData, "summaryAdditions")),
    title,
  };

  await fs.mkdir(versionsDir, { recursive: true });
  await fs.writeFile(path.join(versionsDir, `${slug}.json`), `${JSON.stringify(version, null, 2)}\n`, "utf8");
  revalidatePath("/admin");
  revalidatePath(`/cv/${slug}`);
  redirect("/admin?saved=version");
}

export default async function AdminPage() {
  await requireSession();
  const publicCV = getBaseCV();
  const versions = getCombinedCVs();

  return (
    <div className="admin-root">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Private admin</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white">CV workspace</h1>
            <p className="mt-3 max-w-3xl leading-7 text-gray-400">
              Edit the visible public CV, keep tailored application versions aligned with it, and download generated PDFs when available.
            </p>
          </div>
          <a className="button-secondary w-fit" href="/cv/felipe-mejia-public-cv.pdf">
            Download public PDF
          </a>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.78fr]" aria-labelledby="public-cv-admin">
          <form action={savePublicCV} className="glow-panel">
            <p className="eyebrow" id="public-cv-admin">
              Public CV data
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Visible source of truth</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              This writes to <code>data/cv/public.json</code> and mirrors <code>data/cv/base.json</code> for existing PDF scripts.
            </p>

            <label className="mt-6 block text-sm font-semibold text-white" htmlFor="title">
              Title
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-accent2/50"
              defaultValue={publicCV.title}
              id="title"
              name="title"
            />

            <label className="mt-5 block text-sm font-semibold text-white" htmlFor="summary">
              Summary
            </label>
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent2/50"
              defaultValue={publicCV.summary.join("\n")}
              id="summary"
              name="summary"
            />

            <label className="mt-5 block text-sm font-semibold text-white" htmlFor="selectedAchievements">
              Selected achievements
            </label>
            <textarea
              className="mt-2 min-h-44 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent2/50"
              defaultValue={(publicCV.selectedAchievements || []).join("\n")}
              id="selectedAchievements"
              name="selectedAchievements"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-white" htmlFor="tools">
                  Tools
                </label>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent2/50"
                  defaultValue={(publicCV.tools || []).join(", ")}
                  id="tools"
                  name="tools"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white" htmlFor="languages">
                  Languages
                </label>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent2/50"
                  defaultValue={(publicCV.languages || []).join(", ")}
                  id="languages"
                  name="languages"
                />
              </div>
            </div>

            <button className="button-primary mt-6" type="submit">
              Save public CV
            </button>
          </form>

          <aside className="grid content-start gap-6">
            <section className="glow-panel">
              <p className="eyebrow">Current public CV</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{publicCV.title}</h2>
              <p className="mt-4 leading-7 text-gray-300">{publicCV.summary[0]}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {publicCV.experience.map((item) => (
                  <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 text-xs text-gray-300" key={item.company}>
                    {item.company}
                  </span>
                ))}
              </div>
            </section>

            <section className="glow-panel">
              <p className="eyebrow">Create new version</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Tailored CV version</h2>
              <form action={createCVVersion} className="mt-5 grid gap-4">
                <input className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-accent2/50" name="versionTitle" placeholder="Version title" />
                <input className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-accent2/50" name="application" placeholder="Application / audience" />
                <input className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-accent2/50" name="slug" placeholder="Optional slug" />
                <textarea className="min-h-28 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-accent2/50" name="summaryAdditions" placeholder="Optional summary additions, one per line" />
                <button className="button-secondary w-fit" type="submit">
                  Create version
                </button>
              </form>
            </section>
          </aside>
        </section>

        <section className="mt-10" aria-labelledby="tailored-versions">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Tailored versions</p>
              <h2 className="mt-3 text-3xl font-semibold text-white" id="tailored-versions">
                Application CVs
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">
              Tailoring should emphasize relevant public CV experience. It should not invent claims or contradict the visible source data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {versions.map((version) => (
              <article className="glow-panel" key={version.slug}>
                <p className="text-sm text-accent2">{version.application || "Base version"}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{version.title}</h3>
                <p className="mt-3 line-clamp-3 leading-7 text-gray-300">{version.summary[version.summary.length - 1]}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a className="button-secondary inline-flex" href={`/cv/${version.slug}`}>
                    View version
                  </a>
                  <a className="footer-link inline-flex items-center" href={`/cv/${version.slug}.pdf`}>
                    Download PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
