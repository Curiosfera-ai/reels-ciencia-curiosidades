import { loadFont } from "@remotion/google-fonts/Fredoka";
import type { Estilo } from "./anim";

const fredoka = loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

export const font = fredoka.fontFamily;

// Estilo de la serie: "25d" (volumen, sombras y profundidad) o "plano"
export const ESTILO: Estilo = "25d";

// Subtítulos de los diálogos (la letra de la canción se muestra siempre)
export const SUBTITULOS = true;

// Paleta del Bosque Redondo: pasteles cálidos. Ningún personaje es rojo, azul ni
// amarillo, para que esos tres colores sean solo los de la lección.
export const colors = {
  texto: "#5A3E36",
  crema: "#FFF4E4",
  // Pino
  naranja: "#F59E5B",
  naranjaOscuro: "#E58A48",
  ojos: "#3D2C29",
  rubor: "#F8A5A5",
  boca: "#9C4A4A",
  // Nube
  caparazon: "#78BC8A",
  caparazonClaro: "#A3D6AE",
  pielTortuga: "#BCE3B5",
  patasTortuga: "#A6D6A0",
  bordeCaparazon: "#EAD8B8",
  anteojos: "#7A6A5E",
  // Beto
  rosa: "#F7B2CB",
  rosaOscuro: "#EE97B6",
  rosaClaro: "#FFE2EC",
  pico: "#F7A85C",
  // Bosque
  cieloArriba: "#8FCDF0",
  cieloAbajo: "#E4F5FC",
  lomaLejos: "#CDE9BE",
  lomaMedio: "#B4DDA4",
  pasto: "#A3D492",
  pastoClaro: "#B7DEA6",
  tronco: "#C9A27E",
  copa: "#9DD49A",
  copaClara: "#B9E3B4",
  nube: "#FFFFFF",
  // Colores de la lección
  rojo: "#E85252",
  azul: "#4AA3DF",
  amarillo: "#FFCF3A",
};
