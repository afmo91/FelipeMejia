import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const CV_VARIANTS = [
  { id: "product", label: "Product-focused",  utmKeys: ["linkedin_pm", "google_pm", "referral_product"] },
  { id: "growth",  label: "Growth-focused",   utmKeys: ["linkedin_growth", "google_growth"] },
  { id: "ai",      label: "AI/Tech-focused",  utmKeys: ["linkedin_ai", "referral_ai"] },
  { id: "general", label: "General",          utmKeys: [] },
];

export const metadata = { title: "Admin | Felipe Mejia" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/admin");

  return (
    <div className="admin-root">
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "0.375rem" }}>
          Admin
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2.5rem" }}>
          CV variants, UTM mapping and download log.
        </p>

        {/* CV variants */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "0.875rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem", fontFamily: "var(--font-geist-mono)" }}>
            CV Variants
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {CV_VARIANTS.map(({ id, label, utmKeys }) => (
              <div
                key={id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "1rem 1.25rem",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "12px", gap: "1rem", flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#fff", marginBottom: "0.25rem" }}>{label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-geist-mono)" }}>
                    ID: {id}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "0.6875rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    UTM sources
                  </div>
                  {utmKeys.length === 0 ? (
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Default fallback</span>
                  ) : (
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                      {utmKeys.map((k) => (
                        <span key={k} style={{
                          padding: "0.15rem 0.5rem", background: "rgba(139,92,246,0.12)",
                          border: "1px solid rgba(139,92,246,0.2)", borderRadius: "4px",
                          fontSize: "0.6875rem", fontFamily: "var(--font-geist-mono)", color: "var(--accent)",
                        }}>
                          ?utm_source={k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <a
                  href={`/cv?variant=${id}`}
                  target="_blank"
                  rel="noopener"
                  style={{
                    padding: "0.375rem 0.875rem", background: "transparent",
                    border: "1px solid var(--border)", borderRadius: "8px",
                    fontSize: "0.8125rem", color: "var(--muted)", textDecoration: "none",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                >
                  Preview ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* URL builder */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.875rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-geist-mono)" }}>
            Application Link Builder
          </h2>
          <div style={{
            padding: "1.25rem",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "12px",
          }}>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
              Paste these links in job applications. The site will automatically serve the matching CV variant.
            </p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Use case</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { use: "PM / Product role (LinkedIn)",    utm: "linkedin_pm" },
                  { use: "Growth role (LinkedIn)",          utm: "linkedin_growth" },
                  { use: "AI / Tech role (LinkedIn)",       utm: "linkedin_ai" },
                  { use: "PM / Product role (Google Jobs)", utm: "google_pm" },
                  { use: "Growth role (Google Jobs)",       utm: "google_growth" },
                  { use: "Referral — AI focus",             utm: "referral_ai" },
                  { use: "Referral — Product focus",        utm: "referral_product" },
                ].map(({ use, utm }) => (
                  <tr key={utm}>
                    <td style={{ fontWeight: 500, color: "var(--text)" }}>{use}</td>
                    <td>
                      <code style={{
                        fontSize: "0.75rem",
                        color: "var(--accent2)",
                        fontFamily: "var(--font-geist-mono)",
                        background: "rgba(34,211,238,0.07)",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                      }}>
                        https://felipemejia.com/?utm_source={utm}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.875rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-geist-mono)" }}>
            How it works
          </h2>
          <div style={{
            padding: "1.25rem", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: "12px",
            fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7,
          }}>
            <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Visitor lands via your application link with <code style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent)" }}>utm_source</code> parameter</li>
              <li>They type what brings them here → AI routes them to the Hiring path</li>
              <li>On the CV section, <code style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent)" }}>/api/generate-cv</code> reads the UTM, selects the matching variant</li>
              <li>AI generates a personalised intro paragraph tailored to their context</li>
              <li>Visitor downloads the PDF — the correct variant is served</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
