// Helpers para ElevenLabs. Lee ELEVENLABS_API_KEY desde .env (nunca se imprime).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const loadKey = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const env = readFileSync(join(ROOT, ".env"), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const i = line.indexOf("=");
    if (i > 0 && line.slice(0, i).trim() === "ELEVENLABS_API_KEY") return line.slice(i + 1).trim();
  }
  throw new Error("Falta ELEVENLABS_API_KEY en .env");
};

const KEY = loadKey();

export const api = async (path, init = {}) => {
  const res = await fetch(`https://api.elevenlabs.io${path}`, {
    ...init,
    headers: { "xi-api-key": KEY, ...(init.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res;
};

// Narrador sereno: estabilidad alta y poco "estilo" para que no sobreactúe
const body = (text, settings) =>
  JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    language_code: "es",
    voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true, ...settings },
  });

export const tts = async (voiceId, text, settings = {}) => {
  const res = await api(`/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: body(text, settings),
  });
  return Buffer.from(await res.arrayBuffer());
};

// Igual que tts(), pero además devuelve cuándo se dice cada palabra (en segundos)
export const ttsTimed = async (voiceId, text, settings = {}) => {
  const res = await api(`/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body(text, settings),
  });
  const json = await res.json();
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = json.alignment;
  const words = [];
  let current = null;
  characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      current = null;
      return;
    }
    if (!current) {
      current = { text: "", start: starts[i], end: ends[i] };
      words.push(current);
    }
    current.text += ch;
    current.end = ends[i];
  });
  return { audio: Buffer.from(json.audio_base64, "base64"), words };
};
