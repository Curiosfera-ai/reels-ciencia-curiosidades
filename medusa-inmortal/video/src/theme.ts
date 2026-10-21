import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const montserrat = loadMontserrat("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});
loadMontserrat("italic", { weights: ["800"], subsets: ["latin"] });
const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });

export const fonts = {
  body: montserrat.fontFamily,
  accent: anton.fontFamily,
};

export const colors = {
  bg: "#05060B",
  white: "#F4F7FB",
  muted: "#8A93A6",
  cyan: "#3EE6FF",
  magenta: "#FF4FD8",
  yellow: "#FFE14D",
  red: "#FF4A3D",
};
