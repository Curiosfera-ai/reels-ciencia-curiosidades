import { createContext, useContext } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Cada plano sabe en qué segundo del episodio empieza, así los personajes usan el
// tiempo global (diálogos, parpadeos) y el plano usa su tiempo local.
export const PlanoStart = createContext(0);

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = useContext(PlanoStart);
  const lt = frame / fps;
  return { t: from + lt, lt, fps };
};

const soft = Easing.inOut(Easing.cubic);

// 0 → 1 entre a y b, con aceleración suave
export const ramp = (t: number, a: number, b: number, easing = soft) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// Va de `from` a `to` entre a y b
export const tween = (t: number, a: number, b: number, from: number, to: number, easing = soft) =>
  from + (to - from) * ramp(t, a, b, easing);

// Aparición amable: crece con un rebote muy leve
export const popIn = (t: number, at: number, dur = 0.7) =>
  interpolate(t, [at, at + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.3)),
  });

// Saltito de alegría (0 en reposo, 1 en lo más alto)
export const hop = (t: number, at: number, dur = 0.5) => {
  const p = (t - at) / dur;
  return p < 0 || p > 1 ? 0 : Math.sin(Math.PI * p);
};

// Vaivén lento y continuo
export const sway = (t: number, period: number, phase = 0) => Math.sin((2 * Math.PI * (t + phase)) / period);
