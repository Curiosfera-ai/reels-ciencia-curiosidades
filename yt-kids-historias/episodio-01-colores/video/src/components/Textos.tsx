import React from "react";
import { AbsoluteFill } from "remotion";
import { popIn, ramp, useTime } from "../anim";
import { colors as c, font } from "../theme";
import { LINES, LYRICS, SONG_END, SONG_START, Speaker } from "../timeline";

// Palabra del color, grande y redonda (ROJO, AZUL, AMARILLO)
export const ColorWord: React.FC<{
  text: string;
  color: string;
  at: number;
  x?: number;
  y?: number;
  size?: number;
  contorno?: string; // borde de color para que el amarillo se lea sobre el cielo
}> = ({
  text,
  color,
  at,
  x = 960,
  y = 180,
  size = 210,
  contorno,
}) => {
  const { t } = useTime();
  const p = popIn(t, at, 0.8);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 900,
        top: y - size * 0.65,
        width: 1800,
        textAlign: "center",
        fontFamily: font,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.2,
        color,
        WebkitTextStroke: `${size * 0.09}px #fff`,
        paintOrder: "stroke fill",
        textShadow: contorno
          ? `0 0 ${size * 0.02}px ${contorno}, 0 ${size * 0.04}px 0 ${contorno}, 0 10px 0 rgba(90,62,54,0.10)`
          : "0 10px 0 rgba(90,62,54,0.10)",
        scale: String(p),
        opacity: Math.min(1, p * 1.5),
      }}
    >
      {text}
    </div>
  );
};

export const Titulo: React.FC<{ at: number }> = ({ at }) => {
  const { t } = useTime();
  const p = popIn(t, at, 1);
  const sub = ramp(t, at + 0.9, at + 1.8);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: font, textAlign: "center" }}>
      <div
        style={{
          fontSize: 150,
          fontWeight: 700,
          color: c.naranja,
          WebkitTextStroke: "16px #fff",
          paintOrder: "stroke fill",
          textShadow: "0 12px 0 rgba(90,62,54,0.10)",
          scale: String(p),
          opacity: Math.min(1, p * 1.5),
          marginTop: -120,
        }}
      >
        Las Tardes de Pino
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 76,
          fontWeight: 600,
          color: c.texto,
          background: "rgba(255,253,248,0.9)",
          borderRadius: 60,
          padding: "10px 48px",
          opacity: sub,
          translate: `0 ${(1 - sub) * 20}px`,
        }}
      >
        Pino aprende los colores
      </div>
    </AbsoluteFill>
  );
};

const SPEAKER_COLOR: Record<Speaker, string> = { pino: c.naranja, nube: c.caparazon, beto: c.rosaOscuro };

// Subtítulos de los diálogos: la frase completa, con un puntito del color de quien habla
export const Subtitulos: React.FC = () => {
  const { t } = useTime();
  const l = LINES.find((x) => t >= x.start - 0.1 && t < x.end + 0.5);
  if (!l) return null;
  const o = Math.min(ramp(t, l.start - 0.1, l.start + 0.15), 1 - ramp(t, l.end + 0.2, l.end + 0.5));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 48, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          maxWidth: 1500,
          fontFamily: font,
          fontWeight: 500,
          fontSize: 50,
          color: c.texto,
          background: "rgba(255,253,248,0.88)",
          borderRadius: 50,
          padding: "14px 40px",
        }}
      >
        <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, background: SPEAKER_COLOR[l.speaker] }} />
        {l.text}
      </div>
    </div>
  );
};

const PALABRAS_COLOR: Record<string, string> = { rojo: c.rojo, roja: c.rojo, azul: c.azul, amarillo: c.amarillo };

// Letra de la canción, palabra por palabra al ritmo de la pista
export const Letra: React.FC = () => {
  const { t } = useTime();
  if (t < SONG_START || t >= SONG_END) return null;
  const verso = LYRICS.find((v) => t >= v.start - 0.4 && t < v.end - 0.4) ?? null;
  if (!verso) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          gap: 26,
          fontFamily: font,
          fontWeight: 700,
          fontSize: 76,
          background: "rgba(255,253,248,0.9)",
          borderRadius: 60,
          padding: "12px 52px",
        }}
      >
        {verso.words.map((w, i) => {
          const sung = t >= w.start;
          const key = w.text.toLowerCase().replace(/[^a-záéíóúñ]/g, "");
          const color = PALABRAS_COLOR[key] ?? c.texto;
          const lift = t >= w.start && t < w.start + 0.3 ? Math.sin((Math.PI * (t - w.start)) / 0.3) : 0;
          return (
            <span
              key={i}
              style={{
                color,
                opacity: sung ? 1 : 0.4,
                translate: `0 ${-lift * 10}px`,
                display: "inline-block",
                WebkitTextStroke: color === c.amarillo ? "3px #E2A800" : undefined,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Burbuja con tres puntitos: Pino espera la respuesta de los chicos
export const Esperando: React.FC<{ x: number; y: number; from: number; to: number }> = ({ x, y, from, to }) => {
  const { t } = useTime();
  const o = Math.min(ramp(t, from, from + 0.4), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: x - 110, top: y - 80, opacity: o }} width={220} height={160} viewBox="0 0 220 160">
      <circle cx={30} cy={140} r={10} fill="#fff" />
      <circle cx={52} cy={112} r={15} fill="#fff" />
      <rect x={60} y={10} width={150} height={86} rx={43} fill="#fff" />
      {[0, 1, 2].map((i) => {
        const b = Math.max(0, Math.sin(2 * Math.PI * (t * 0.9 - i * 0.18)));
        return <circle key={i} cx={100 + i * 36} cy={53 - b * 8} r={11} fill={c.texto} opacity={0.35 + 0.45 * b} />;
      })}
    </svg>
  );
};

// Notas musicales que suben flotando
export const Notas: React.FC<{ from: number; x: number; y: number }> = ({ from, x, y }) => {
  const { t } = useTime();
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      {[0, 1, 2, 3, 4].map((i) => {
        const p = (t - from - i * 0.6) / 3;
        if (p < 0 || p > 1) return null;
        const nx = x + (i % 2 ? 1 : -1) * (40 + i * 30) + 30 * Math.sin(p * 6 + i);
        const ny = y - p * 320;
        const col = [c.rojo, c.azul, c.amarillo][i % 3];
        return (
          <g key={i} transform={`translate(${nx} ${ny})`} opacity={Math.sin(Math.PI * p)}>
            <ellipse cx={0} cy={0} rx={16} ry={12} transform="rotate(-20)" fill={col} />
            <rect x={11} y={-56} width={6} height={56} rx={3} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};
