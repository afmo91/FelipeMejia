import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const cvPath = path.join(process.cwd(), "public/cv/felipe-mejia-public-cv.pdf");
  const file = await fs.readFile(cvPath);

  return new Response(file, {
    headers: {
      "Content-Disposition": 'attachment; filename="Felipe-Mejia-CV.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
