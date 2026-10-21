import cancion from "./cancion.json";
import dialogo from "./dialogo.json";
import voiceover from "./voiceover.json";

// Todo el episodio se mide en segundos. Los planos son fijos (ver ../guion.md);
// los diálogos se ubican con "at" (segundo exacto) o "pauseBefore" (silencio
// después de la frase anterior). Mientras no haya voces grabadas, la duración de
// cada frase se estima con la velocidad de habla de cada personaje.

export const DURACION = 256;
export const FUNDIDO = 0.6; // fundido suave entre planos (no hay cortes secos)

// [desde, hasta] de cada plano, en segundos
export const PLANOS: readonly [number, number][] = [
  [0, 8], // 1 título
  [8, 18], // 2 Pino saluda
  [18, 28], // 3 el tema y los tres círculos
  [28, 36], // 4 Pino camina
  [36, 46], // 5 Nube y el manzano
  [46, 56], // 6 la manzana: ROJO
  [56, 68], // 7 pregunta: manzana
  [68, 78], // 8 hongo y frutilla
  [78, 88], // 9 llega Beto, la cámara sube
  [88, 98], // 10 el cielo: AZUL
  [98, 110], // 11 pregunta: cielo
  [110, 120], // 12 laguna y flores
  [120, 130], // 13 los tres y el sol
  [130, 140], // 14 el sol: AMARILLO
  [140, 152], // 15 pregunta: sol
  [152, 162], // 16 girasol y mariposa
  [162, 172], // 17 resumen: los tres objetos
  [172, 190], // 18 resumen con pausas
  [190, 200], // 19 ¡a cantar!
  [200, 215], // 20 canción: estribillo
  [215, 227], // 21 canción: estrofa
  [227, 242], // 22 canción: estribillo y arcoíris
  [242, 256], // 23 despedida
];

export type Speaker = "pino" | "nube" | "beto";
export type Word = { readonly text: string; readonly start: number; readonly end: number };
export type Line = {
  readonly id: string;
  readonly speaker: Speaker;
  readonly text: string;
  readonly start: number;
  readonly end: number;
  readonly words: Word[];
  readonly hasVoice: boolean;
};

type RawLine = { id: string; speaker: string; text: string; at?: number; pauseBefore?: number };
type VoiceClip = { id: string; duration: number; words: Word[] };

// Letras por segundo: Nube habla lento, Beto rápido
const RATE: Record<Speaker, number> = { pino: 13, nube: 9, beto: 14 };

const estimate = (text: string, speaker: Speaker): Word[] => {
  let t = 0;
  return text.split(/\s+/).map((w) => {
    const letters = w.replace(/[^\p{L}]/gu, "").length;
    const d = Math.max(0.2, letters / RATE[speaker]);
    const word = { text: w, start: t, end: t + d };
    t += d + (/…$/.test(w) ? 0.35 : /[.!?]$/.test(w) ? 0.18 : /[,:]$/.test(w) ? 0.1 : 0.04);
    return word;
  });
};

const voices = voiceover as unknown as VoiceClip[];

const buildLines = (): Line[] => {
  let prevEnd = 0;
  return (dialogo as RawLine[]).map((raw) => {
    const speaker = raw.speaker as Speaker;
    const start = raw.at ?? prevEnd + (raw.pauseBefore ?? 0.4);
    const voice = voices.find((v) => v.id === raw.id);
    const rel = voice ? voice.words : estimate(raw.text, speaker);
    const words = rel.map((w) => ({ text: w.text, start: start + w.start, end: start + w.end }));
    const end = start + (voice ? voice.duration : rel[rel.length - 1].end);
    prevEnd = end;
    return { id: raw.id, speaker, text: raw.text, start, end, words, hasVoice: Boolean(voice) };
  });
};

export const LINES = buildLines();

export const line = (id: string): Line => {
  const l = LINES.find((x) => x.id === id);
  if (!l) throw new Error(`No existe la frase ${id}`);
  return l;
};

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

// Segundo en que se dice una palabra (nth: la segunda vez que aparece, etc.)
export const wordAt = (id: string, word: string, nth = 1, edge: "start" | "end" = "start") => {
  const matches = line(id).words.filter((w) => normalize(w.text).startsWith(normalize(word)));
  const w = matches[nth - 1];
  if (!w) throw new Error(`No encuentro "${word}" en ${id}`);
  return w[edge];
};

// --- Canción ------------------------------------------------------------

export const BEAT = 60 / cancion.bpm;
export const SONG_START = cancion.inicio;
export const SONG_END = SONG_START + (cancion.introBeats + cancion.versos.length * 4 + cancion.outroBeats) * BEAT;

type Syllable = { start: number; end: number };
export type LyricLine = { start: number; end: number; words: Word[] };

const buildSong = () => {
  const syllables: Syllable[] = [];
  const lyrics: LyricLine[] = cancion.versos.map((verso, i) => {
    const lineStart = SONG_START + (cancion.introBeats + i * 4) * BEAT;
    let cursor = lineStart;
    const words = verso.palabras.map((p) => {
      const start = cursor;
      for (const [beats] of p.syl) {
        const d = beats * BEAT;
        syllables.push({ start: cursor, end: cursor + d });
        cursor += d;
      }
      return { text: p.text, start, end: cursor };
    });
    return { start: lineStart, end: lineStart + 4 * BEAT, words };
  });
  return { syllables, lyrics };
};

export const { syllables: SYLLABLES, lyrics: LYRICS } = buildSong();

// --- Boca y parpadeo ----------------------------------------------------

const SYLLABLE_RATE: Record<Speaker, number> = { pino: 5, nube: 3.4, beto: 6.5 };

export const mouthOf = (speaker: Speaker, t: number): number => {
  if (t >= SONG_START && t < SONG_END) {
    const s = SYLLABLES.find((x) => t >= x.start && t < x.end - 0.04);
    if (!s) return 0;
    const p = t - s.start;
    return Math.min(1, p / 0.08) * (s.end - s.start > 0.5 ? 0.85 : 0.85 * Math.sin((Math.PI * p) / (s.end - s.start)) + 0.15);
  }
  const l = LINES.find((x) => x.speaker === speaker && t >= x.start && t < x.end);
  if (!l) return 0;
  const w = l.words.find((x) => t >= x.start && t < x.end);
  if (!w) return 0;
  return Math.abs(Math.sin(Math.PI * SYLLABLE_RATE[speaker] * (t - w.start)));
};

const BLINK: Record<Speaker, [number, number, number]> = {
  // [cada cuántos segundos, cuánto dura, desfase]
  pino: [3.7, 0.16, 0.4],
  nube: [5.3, 0.34, 2.1],
  beto: [2.9, 0.14, 1.3],
};

export const blinkOf = (speaker: Speaker, t: number): number => {
  const [period, len, off] = BLINK[speaker];
  const p = (t + off) % period;
  return p < len ? Math.sin((Math.PI * p) / len) : 0;
};

export const speaking = (speaker: Speaker, t: number) =>
  LINES.some((l) => l.speaker === speaker && t >= l.start && t < l.end);
