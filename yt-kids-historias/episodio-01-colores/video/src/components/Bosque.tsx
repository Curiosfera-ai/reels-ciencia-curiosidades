import React from "react";
import { AbsoluteFill } from "remotion";
import { useTime } from "../anim";
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

export const Arbol: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-17} y={-150} width={34} height={150} rx={17} fill={c.tronco} />
    <circle cx={0} cy={-200} r={92} fill={c.copa} />
    <circle cx={-28} cy={-228} r={44} fill={c.copaClara} opacity={0.7} />
  </g>
);

export const Bosque: React.FC<{ pan?: number; tilt?: number; zoom?: number; sinArboles?: boolean }> = ({
  pan = 0,
  tilt = 0,
  zoom = 1,
  sinArboles = false,
}) => {
  const { t } = useTime();
  const down = tilt * TILT_PX;
  return (
    <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 86%" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.cieloArriba} />
            <stop offset="1" stopColor={c.cieloAbajo} />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#cielo)" />
        <g transform={`translate(0 ${down * 0.5})`}>
          {NUBES.map(([x, y, s], i) => {
            const nx = ((((x - pan * 0.1 + t * 11) % 2400) + 2400) % 2400) - 250;
            return <Nubecita key={i} x={nx} y={y} s={s} />;
          })}
        </g>
        <g transform={`translate(0 ${down})`}>
          <Repeat offset={pan * 0.3}>
            {LOMAS_LEJOS.map(([x, r]) => (
              <circle key={x} cx={x} cy={1060} r={r} fill={c.lomaLejos} />
            ))}
          </Repeat>
          <Repeat offset={pan * 0.55}>
            {LOMAS_MEDIO.map(([x, r]) => (
              <circle key={x} cx={x} cy={1240} r={r} fill={c.lomaMedio} />
            ))}
            {sinArboles ? null : ARBOLES.map(([x, s]) => <Arbol key={x} x={x} y={830} s={s * 0.8} />)}
          </Repeat>
          <Repeat offset={pan}>
            <rect x={0} y={880} width={W} height={1400} fill={c.pasto} />
            {[0, 600, 1200, 1800, 2400].map((x) => (
              <ellipse key={x} cx={x + 300} cy={890} rx={420} ry={50} fill={c.pasto} />
            ))}
            {[200, 1100, 2000].map((x) => (
              <ellipse key={x} cx={x} cy={1000} rx={260} ry={28} fill={c.pastoClaro} opacity={0.6} />
            ))}
            {FLORES.map(([x, y, color]) => (
              <Florcita key={x} x={x} y={y} color={color} />
            ))}
          </Repeat>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
