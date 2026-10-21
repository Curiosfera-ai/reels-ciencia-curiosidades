// Genera la voz en off placa por placa con ElevenLabs → public/voiceover/*.mp3
// Uso: node scripts/generate-voiceover.mjs [id-de-placa ...]   (sin argumentos: todas)
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, tts } from "./elevenlabs.mjs";

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George - Warm, Captivating Storyteller
const OUT = join(ROOT, "public", "voiceover");

// El texto va escrito como se pronuncia ("dórnii") para guiar a la voz
export const SCENES = [
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
const only = process.argv.slice(2);
for (const [id, text] of SCENES) {
  if (only.length && !only.includes(id)) continue;
  writeFileSync(join(OUT, `${id}.mp3`), await tts(VOICE_ID, text));
  console.log(`  ${id}.mp3`);
}
