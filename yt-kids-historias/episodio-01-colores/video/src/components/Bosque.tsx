import React from "react";
import { AbsoluteFill } from "remotion";
import { useEstilo, useTime } from "../anim";
import { colors as c } from "../theme";

// El Bosque Redondo: cielo, nubes, lomas redondas, árboles chupetín y pasto con
// florcitas. `pan` mueve la cámara a la derecha (con paralaje) y `tilt` la sube
// hacia el cielo (0 = suelo a la vista, 1 = solo cielo).

export const SUELO = 930; // donde apoyan los pies los personajes
export const TILT_PX = 900; // cuánto baja el suelo cuando la cámara mira al cielo

const W = 3000; // ancho del patrón que se repite

const Repeat: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => {
  const x = -(((offset % W) + W) % W);
  return (
    <>
      <g transform={`translate(${x} 0)`}>{children}</g>
      <g transform={`translate(${x + W} 0)`}>{children}</g>
    </>
  );
};

export const Nubecita: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c.nube}>
    <ellipse cx={0} cy={20} rx={130} ry={42} />
    <circle cx={-55} cy={0} r={52} />
    <circle cx={15} cy={-22} r={70} />
    <circle cx={80} cy={8} r={48} />
  </g>
);

const NUBES = [
  [100, 150, 0.9],
  [700, 90, 0.7],
  [1250, 200, 1],
  [1900, 120, 0.8],
  [400, -250, 1.1],
  [1500, -330, 0.9],
  [950, -120, 0.75],
  [2100, -200, 1],
] as const;

const LOMAS_LEJOS = [
  [0, 430],
  [520, 380],
  [1000, 470],
  [1560, 400],
  [2100, 450],
  [2600, 390],
] as const;

const LOMAS_MEDIO = [
  [250, 520],
  [900, 560],
  [1600, 500],
  [2300, 560],
] as const;

const ARBOLES = [
  [140, 1],
  [470, 0.8],
  [880, 1.15],
  [1320, 0.9],
  [1760, 1.05],
  [2150, 0.85],
  [2520, 1.1],
  [2860, 0.8],
] as const;

const FLORES = [
  [60, 960, "#F7B7C8"],
  [330, 1010, "#fff"],
  [610, 945, "#F7B7C8"],
  [930, 1040, "#fff"],
  [1180, 975, "#F7B7C8"],
  [1490, 1030, "#fff"],
  [1760, 955, "#F7B7C8"],
  [2050, 1015, "#fff"],
  [2380, 965, "#F7B7C8"],
  [2700, 1035, "#fff"],
] as const;

const Florcita: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <circle key={a} cx={9 * Math.cos((a * Math.PI) / 180)} cy={9 * Math.sin((a * Math.PI) / 180)} r={7} fill={color} />
    ))}
    <circle r={5} fill="#FFE7A8" />
  </g>
);

export const Arbol: React.FC<{ x: number; y: number; s: number; vol?: boolean }> = ({ x, y, s, vol = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {vol ? <ellipse cx={0} cy={0} rx={60} ry={12} fill="#5E8F4E" opacity={0.25} /> : null}
    <rect x={-17} y={-150} width={34} height={150} rx={17} fill={vol ? "url(#tronco25)" : c.tronco} />
    <circle cx={0} cy={-200} r={92} fill={vol ? "url(#copa25)" : c.copa} />
    {vol ? null : <circle cx={-28} cy={-228} r={44} fill={c.copaClara} opacity={0.7} />}
  </g>
);

export const Bosque: React.FC<{ pan?: number; tilt?: number; zoom?: number; sinArboles?: boolean }> = ({
  pan = 0,
  tilt = 0,
  zoom = 1,
  sinArboles = false,
}) => {
  const { t } = useTime();
  const vol = useEstilo() === "25d";
  const down = tilt * TILT_PX;
  // En 2.5D, lo lejano se desenfoca (más aún en los primeros planos, con zoom)
  const blurLejos = vol ? `url(#desenfoque-lejos)` : undefined;
  const blurMedio = vol ? `url(#desenfoque-medio)` : undefined;
  return (
    <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 86%" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.cieloArriba} />
            <stop offset="1" stopColor={c.cieloAbajo} />
          </linearGradient>
          {vol ? (
            <>
              <filter id="desenfoque-lejos" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation={4 * zoom * zoom} />
              </filter>
              <filter id="desenfoque-medio" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation={1.6 * zoom * zoom} />
              </filter>
              <radialGradient id="copa25" cx="0.35" cy="0.3" r="0.8">
                <stop offset="0" stopColor="#C8EBC2" />
                <stop offset="0.55" stopColor={c.copa} />
                <stop offset="1" stopColor="#74B270" />
              </radialGradient>
              <linearGradient id="tronco25" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#DDB894" />
                <stop offset="1" stopColor="#A9805C" />
              </linearGradient>
              <linearGradient id="pasto25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#B8DFA6" />
                <stop offset="0.35" stopColor={c.pasto} />
                <stop offset="1" stopColor="#8DC47C" />
              </linearGradient>
              <radialGradient id="sol25" cx="0.12" cy="0.05" r="0.9">
                <stop offset="0" stopColor="#FFF3C9" stopOpacity={0.55} />
                <stop offset="0.5" stopColor="#FFF3C9" stopOpacity={0.12} />
                <stop offset="1" stopColor="#FFF3C9" stopOpacity={0} />
              </radialGradient>
            </>
          ) : null}
        </defs>
        <rect width={1920} height={1080} fill="url(#cielo)" />
        <g transform={`translate(0 ${down * 0.5})`}>
          {NUBES.map(([x, y, s], i) => {
            const nx = ((((x - pan * 0.1 + t * 11) % 2400) + 2400) % 2400) - 250;
            return <Nubecita key={i} x={nx} y={y} s={s} />;
          })}
        </g>
        <g transform={`translate(0 ${down})`}>
          <g filter={blurLejos}>
            <Repeat offset={pan * 0.3}>
              {LOMAS_LEJOS.map(([x, r]) => (
                <circle key={x} cx={x} cy={1060} r={r} fill={c.lomaLejos} />
              ))}
            </Repeat>
          </g>
          <g filter={blurMedio}>
            <Repeat offset={pan * 0.55}>
              {LOMAS_MEDIO.map(([x, r]) => (
                <circle key={x} cx={x} cy={1240} r={r} fill={c.lomaMedio} />
              ))}
              {sinArboles ? null : ARBOLES.map(([x, s]) => <Arbol key={x} x={x} y={830} s={s * 0.8} vol={vol} />)}
            </Repeat>
          </g>
          <Repeat offset={pan}>
            <rect x={0} y={880} width={W} height={1400} fill={vol ? "url(#pasto25)" : c.pasto} />
            {[0, 600, 1200, 1800, 2400].map((x) => (
              <ellipse key={x} cx={x + 300} cy={890} rx={420} ry={50} fill={vol ? "#B3DCA1" : c.pasto} />
            ))}
            {[200, 1100, 2000].map((x) => (
              <ellipse key={x} cx={x} cy={1000} rx={260} ry={28} fill={c.pastoClaro} opacity={0.6} />
            ))}
            {FLORES.map(([x, y, color]) => (
              <Florcita key={x} x={x} y={y} color={color} />
            ))}
          </Repeat>
        </g>
        {vol ? <rect width={1920} height={1080} fill="url(#sol25)" /> : null}
      </svg>
    </AbsoluteFill>
  );
};
