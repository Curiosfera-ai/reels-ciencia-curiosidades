// Genera las voces de Pino, Nube y Beto frase por frase con ElevenLabs:
//   public/voces/<id>.mp3  +  src/voiceover.json (duración y cuándo se dice cada palabra)
// Los textos salen de src/dialogo.json. Al haber voz, la animación usa los tiempos reales.
// Uso: npm run voces [id ...]          (sin argumentos: todas las frases)
//      npm run voces -- --muestras     (una frase de prueba por personaje, en muestras-voz/)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, tts, ttsTimed } from "./elevenlabs.mjs";

// Tres voces bien distintas en tono y velocidad, para que un chico de 4 años sepa
// quién habla sin leer. Cambiar los voiceId acá después de escuchar las muestras.
const VOCES = {
  // Pino: media-aguda, alegre y cálida, algo pausada
  pino: { voiceId: "cgSgspJ2msm6clMCkdW9", settings: { speed: 0.92, stability: 0.5, style: 0.35 } },
  // Nube: grave, muy lenta y suave
  nube: { voiceId: "pqHfZKP75CyZlD1AqVGX", settings: { speed: 0.75, stability: 0.7, style: 0.1 } },
  // Beto: muy aguda, rápida y cantarina
  beto: { voiceId: "FGY2WhTYpPnrIDTdsKH5", settings: { speed: 1.15, stability: 0.35, style: 0.6 } },
};

const lines = JSON.parse(readFileSync(join(ROOT, "src", "dialogo.json"), "utf8"));

if (process.argv.includes("--muestras")) {
  const dir = join(ROOT, "..", "muestras-voz");
  mkdirSync(dir, { recursive: true });
  for (const [speaker, v] of Object.entries(VOCES)) {
    const sample = lines.find((l) => l.speaker === speaker);
    writeFileSync(join(dir, `${speaker}.mp3`), await tts(v.voiceId, sample.text, v.settings));
    console.log(`  muestras-voz/${speaker}.mp3  "${sample.text}"`);
  }
  process.exit(0);
}

const OUT = join(ROOT, "public", "voces");
const TIMINGS = join(ROOT, "src", "voiceover.json");
mkdirSync(OUT, { recursive: true });
const previous = existsSync(TIMINGS) ? JSON.parse(readFileSync(TIMINGS, "utf8")) : [];
const only = process.argv.slice(2);
const clips = [];
for (const l of lines) {
  if (only.length && !only.includes(l.id)) {
    const old = previous.find((c) => c.id === l.id);
    if (old) clips.push(old);
    continue;
  }
  const v = VOCES[l.speaker];
  const { audio, words } = await ttsTimed(v.voiceId, l.text, v.settings);
  writeFileSync(join(OUT, `${l.id}.mp3`), audio);
  const duration = words[words.length - 1].end;
  clips.push({ id: l.id, duration, words });
  console.log(`  ${l.id}.mp3  (${duration.toFixed(2)} s)  ${l.speaker}`);
}
writeFileSync(TIMINGS, JSON.stringify(clips, null, 2) + "\n");
console.log(`Listo: ${clips.length} frases con voz.`);
