import clips from "./voiceover.json";

// Cada placa dura lo que dura su frase + pausas mínimas (en frames).
// Los tiempos salen de src/voiceover.json, que escribe scripts/generate-voiceover.mjs.
export const LEAD = 2; // silencio antes de la frase
export const GAP = 5; // silencio después de la frase
export const HOOK_TAIL = 18; // deja ver "¿Cómo lo hace?" después del hook
export const OUTRO = 48; // salida suave: la medusa vuelve a la posición inicial

export type SceneId =
  | "01-hook"
  | "02-nombre"
  | "03-tamano"
  | "04-envejece"
  | "05-no-muere"
  | "06-quiste"
  | "07-clave"
  | "08-polipo"
  | "09-brotes"
  | "10-cierre";

type Slot = { readonly from: number; readonly dur: number; readonly lead: number; readonly speechEnd: number };

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

export const timeline = (fps: number): Record<SceneId, Slot> => {
  let from = 0;
  const slots = {} as Record<SceneId, Slot>;
  clips.forEach((clip, i) => {
    const lead = i === 0 ? 0 : LEAD;
    const tail = i === 0 ? HOOK_TAIL : i === clips.length - 1 ? OUTRO : GAP;
    const speechEnd = lead + Math.ceil(clip.speechEnd * fps);
    const dur = speechEnd + tail;
    slots[clip.id as SceneId] = { from, dur, lead, speechEnd };
    from += dur;
  });
  return slots;
};

export const totalFrames = (fps: number) => Object.values(timeline(fps)).reduce((sum, s) => sum + s.dur, 0);

// Frame (relativo al inicio de la placa) en que la voz dice una palabra
export const cue = (id: SceneId, word: string, fps: number, edge: "start" | "end" = "start") => {
  const clip = clips.find((c) => c.id === id);
  const w = clip?.words.find((x) => normalize(x.text).startsWith(normalize(word)));
  if (!clip || !w) throw new Error(`No encuentro "${word}" en la placa ${id}`);
  const lead = clips.indexOf(clip) === 0 ? 0 : LEAD;
  return lead + Math.round(w[edge] * fps);
};
