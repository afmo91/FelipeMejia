export const runtime = "nodejs";

const API_KEY  = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID!;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { text?: string };
  const text = (body.text ?? "").trim().slice(0, 500);

  if (!text || !API_KEY || !VOICE_ID) {
    return new Response("Missing text or credentials", { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.48,
            similarity_boost: 0.78,
            style: 0.12,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      return new Response("TTS error", { status: res.status });
    }

    return new Response(res.body, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch {
    return new Response("TTS failed", { status: 500 });
  }
}
