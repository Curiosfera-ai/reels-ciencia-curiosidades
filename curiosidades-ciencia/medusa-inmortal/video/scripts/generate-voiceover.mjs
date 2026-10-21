// Genera la voz en off placa por placa con ElevenLabs:
//   public/voiceover/*.mp3  +  src/voiceover.json (cuándo se dice cada palabra)
// Uso: node scripts/generate-voiceover.mjs [id-de-placa ...]   (sin argumentos: todas)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, ttsTimed } from "./elevenlabs.mjs";

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - Warm, Captivating Storyteller
const SPEED = 1.1; // 10% más rápida para quedar cerca de 35 s
const OUT = join(ROOT, "public", "voiceover");
const TIMINGS = join(ROOT, "src", "voiceover.json");

// El texto va escrito como se pronuncia ("dórnii") para guiar a la voz
const SCENES = [
  ["01-hook", "Este animal es prácticamente inmortal."],
  ["02-nombre", "Se llama Turritopsis dórnii…"],
  ["03-tamano", "…y es una medusa diminuta: apenas cuatro milímetros y medio."],
  ["04-envejece", "Para casi todos los animales, envejecer o lastimarse es el principio del fin."],
  ["05-no-muere", "Pero ella hace algo distinto. En lugar de morir… se hunde, y se encoge."],
  ["06-quiste", "Su cuerpo se reduce a una pequeña bolita de células."],
  ["07-clave", "Y entonces ocurre la clave: sus células cambian de tipo. Transdiferenciación."],
  ["08-polipo", "Así vuelve a ser un pólipo, como en su juventud."],
  ["09-brotes", "Y de ese pólipo brotan medusas nuevas, genéticamente idénticas."],
  ["10-cierre", "Una y otra vez… mientras nada se la coma."],
];

mkdirSync(OUT, { recursive: true });
const previous = existsSync(TIMINGS) ? JSON.parse(readFileSync(TIMINGS, "utf8")) : [];
const only = process.argv.slice(2);
const clips = [];
for (const [id, text] of SCENES) {
  if (only.length && !only.includes(id)) {
    clips.push(previous.find((c) => c.id === id));
    continue;
  }
  const { audio, words } = await ttsTimed(VOICE_ID, text, { speed: SPEED });
  writeFileSync(join(OUT, `${id}.mp3`), audio);
  const speechEnd = words[words.length - 1].end;
  clips.push({ id, speechEnd, words });
  console.log(`  ${id}.mp3  (${speechEnd.toFixed(2)} s de voz)`);
}
writeFileSync(TIMINGS, JSON.stringify(clips, null, 2) + "\n");
console.log(`Total de voz: ${clips.reduce((s, c) => s + c.speechEnd, 0).toFixed(2)} s`);
