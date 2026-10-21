import React, { useId } from "react";
import { useTime } from "../anim";
import { colors as c } from "../theme";
import { Nubecita } from "./Bosque";

// Contenedor: ubica un dibujo por su centro, con escala, giro y un brillo suave detrás
export const Obj: React.FC<{
  x: number;
  y: number;
  size: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
  glow?: number;
  ratio?: number; // alto / ancho
  children: React.ReactNode;
}> = ({ x, y, size, scale = 1, rotate = 0, opacity = 1, glow = 0, ratio = 1, children }) => {
  const id = useId().replace(/:/g, "");
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - (size * ratio) / 2,
        width: size,
        height: size * ratio,
        scale: String(scale),
        rotate: `${rotate}deg`,
        opacity,
      }}
    >
      {glow > 0 ? (
        <svg
          viewBox="0 0 100 100"
          style={{ position: "absolute", left: "-35%", top: "-35%", width: "170%", height: "170%", opacity: glow }}
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id={`glow-${id}`}>
              <stop offset="0" stopColor="#FFFBEA" stopOpacity={0.95} />
              <stop offset="0.55" stopColor="#FFF6D6" stopOpacity={0.45} />
              <stop offset="1" stopColor="#FFF6D6" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={50} cy={50} r={50} fill={`url(#glow-${id})`} />
        </svg>
      ) : null}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};

const svg = (viewBox: string, children: React.ReactNode) => (
  <svg viewBox={viewBox} width="100%" height="100%" style={{ overflow: "visible" }}>
    {children}
  </svg>
);

export const Manzana: React.FC = () =>
  svg(
    "0 0 200 200",
    <>
      <path d="M100 62 Q98 40 110 26" stroke={c.tronco} strokeWidth={9} strokeLinecap="round" fill="none" />
      <ellipse cx={132} cy={44} rx={26} ry={12} transform="rotate(-25 132 44)" fill="#8CCB7E" />
      <circle cx={76} cy={116} r={60} fill={c.rojo} />
      <circle cx={124} cy={116} r={60} fill={c.rojo} />
      <ellipse cx={100} cy={142} rx={76} ry={48} fill={c.rojo} />
      <ellipse cx={66} cy={98} rx={13} ry={24} transform="rotate(-25 66 98)" fill="#fff" opacity={0.45} />
    </>,
  );

export const Hongo: React.FC = () =>
  svg(
    "0 0 200 200",
    <>
      <rect x={72} y={104} width={56} height={84} rx={26} fill={c.crema} />
      <path d="M18 122 Q18 36 100 36 Q182 36 182 122 Q100 138 18 122 Z" fill={c.rojo} />
      {[
        [62, 80, 13],
        [108, 60, 11],
        [146, 92, 12],
        [96, 104, 9],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#fff" />
      ))}
    </>,
  );

export const Frutilla: React.FC = () =>
  svg(
    "0 0 200 200",
    <>
      <path d="M100 188 C40 152 28 96 48 72 C68 50 132 50 152 72 C172 96 160 152 100 188 Z" fill={c.rojo} />
      {[
        [78, 96],
        [112, 92],
        [140, 108],
        [64, 124],
        [98, 124],
        [130, 138],
        [84, 152],
        [112, 160],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={4} ry={6} fill="#FFE7A8" />
      ))}
      {[-60, -25, 10, 45].map((a) => (
        <ellipse key={a} cx={100} cy={56} rx={30} ry={11} transform={`rotate(${a + 180} 100 64)`} fill="#8CCB7E" />
      ))}
      <rect x={95} y={30} width={10} height={24} rx={5} fill="#7DBB6F" />
    </>,
  );

export const FlorAzul: React.FC = () =>
  svg(
    "0 0 200 260",
    <>
      <path d="M100 250 Q96 180 100 110" stroke="#7DBB6F" strokeWidth={10} strokeLinecap="round" fill="none" />
      <ellipse cx={72} cy={190} rx={28} ry={12} transform="rotate(-30 72 190)" fill="#8CCB7E" />
      <ellipse cx={128} cy={170} rx={28} ry={12} transform="rotate(30 128 170)" fill="#8CCB7E" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={100 + 34 * Math.cos(((a - 90) * Math.PI) / 180)}
          cy={80 + 34 * Math.sin(((a - 90) * Math.PI) / 180)}
          r={28}
          fill={c.azul}
        />
      ))}
      <circle cx={100} cy={80} r={20} fill={c.crema} />
    </>,
  );

export const Sol: React.FC<{ cara?: boolean }> = ({ cara = true }) => {
  const { t } = useTime();
  return svg(
    "0 0 400 400",
    <>
      <g transform={`rotate(${t * 6} 200 200)`}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={188} y={20} width={24} height={52} rx={12} fill={c.amarillo} transform={`rotate(${i * 30} 200 200)`} />
        ))}
      </g>
      <circle cx={200} cy={200} r={118} fill={c.amarillo} />
      <circle cx={200} cy={200} r={118} fill="#FFE27A" opacity={0.35} />
      {cara ? (
        <g stroke={c.ojos} strokeWidth={8} strokeLinecap="round" fill="none">
          <path d="M146 188 Q162 168 178 188" />
          <path d="M222 188 Q238 168 254 188" />
          <path d="M168 232 Q200 262 232 232" />
          <ellipse cx={136} cy={222} rx={18} ry={11} fill={c.rubor} stroke="none" opacity={0.8} />
          <ellipse cx={264} cy={222} rx={18} ry={11} fill={c.rubor} stroke="none" opacity={0.8} />
        </g>
      ) : null}
    </>,
  );
};

export const Girasol: React.FC = () => {
  const { t } = useTime();
  return svg(
    "0 0 300 500",
    <g transform={`rotate(${2.5 * Math.sin((2 * Math.PI * t) / 4)} 150 500)`}>
      <path d="M150 500 Q140 340 150 200" stroke="#7DBB6F" strokeWidth={16} strokeLinecap="round" fill="none" />
      <ellipse cx={104} cy={380} rx={48} ry={18} transform="rotate(-30 104 380)" fill="#8CCB7E" />
      <ellipse cx={196} cy={320} rx={48} ry={18} transform="rotate(30 196 320)" fill="#8CCB7E" />
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse key={i} cx={150} cy={78} rx={20} ry={44} fill={c.amarillo} transform={`rotate(${i * (360 / 14)} 150 150)`} />
      ))}
      <circle cx={150} cy={150} r={56} fill="#A97A4C" />
      <circle cx={150} cy={150} r={40} fill="#946840" />
      <g stroke={c.ojos} strokeWidth={6} strokeLinecap="round" fill="none">
        <path d="M128 144 Q136 134 144 144" />
        <path d="M156 144 Q164 134 172 144" />
        <path d="M134 164 Q150 178 166 164" />
      </g>
    </g>,
  );
};

export const Mariposa: React.FC = () => {
  const { t } = useTime();
  const flap = 0.35 + 0.65 * Math.abs(Math.cos(2 * Math.PI * 1.6 * t));
  return svg(
    "0 0 160 130",
    <>
      <g transform={`translate(80 0) scale(${flap} 1) translate(-80 0)`}>
        <ellipse cx={48} cy={48} rx={36} ry={30} fill={c.amarillo} />
        <ellipse cx={112} cy={48} rx={36} ry={30} fill={c.amarillo} />
        <ellipse cx={54} cy={92} rx={24} ry={20} fill="#FFDD6E" />
        <ellipse cx={106} cy={92} rx={24} ry={20} fill="#FFDD6E" />
        <circle cx={46} cy={46} r={9} fill="#fff" opacity={0.6} />
        <circle cx={114} cy={46} r={9} fill="#fff" opacity={0.6} />
      </g>
      <ellipse cx={80} cy={70} rx={8} ry={34} fill="#7A5A48" />
      <path d="M76 38 Q66 14 58 10 M84 38 Q94 14 102 10" stroke="#7A5A48" strokeWidth={4} fill="none" strokeLinecap="round" />
    </>,
  );
};

export const Circulo: React.FC<{ color: string }> = ({ color }) =>
  svg(
    "0 0 200 200",
    <>
      <circle cx={100} cy={106} r={88} fill="#000" opacity={0.06} />
      <circle cx={100} cy={100} r={88} fill={color} />
      <ellipse cx={70} cy={66} rx={22} ry={14} transform="rotate(-35 70 66)" fill="#fff" opacity={0.45} />
    </>,
  );

// El cielo, en chiquito: círculo azul con una nube adentro
export const CieloIcono: React.FC = () =>
  svg(
    "0 0 200 200",
    <>
      <circle cx={100} cy={100} r={88} fill={c.azul} />
      <Nubecita x={104} y={112} s={0.42} />
    </>,
  );

// Plato blanco redondo donde se apoyan los objetos del resumen
export const Plato: React.FC = () =>
  svg(
    "0 0 200 200",
    <>
      <circle cx={100} cy={106} r={98} fill="#000" opacity={0.05} />
      <circle cx={100} cy={100} r={98} fill="#FFFDF8" />
    </>,
  );

export const Laguna: React.FC<{ ripple?: number }> = ({ ripple = 0 }) => {
  const { t } = useTime();
  const r = (k: number) => 0.5 + 0.5 * ((t * 0.35 + k / 3) % 1);
  return svg(
    "0 0 700 180",
    <>
      <ellipse cx={350} cy={95} rx={340} ry={82} fill="#D8EFC9" />
      <ellipse cx={350} cy={95} rx={318} ry={70} fill={c.azul} />
      <ellipse cx={300} cy={78} rx={210} ry={30} fill="#7CC0EC" opacity={0.6} />
      {[0, 1, 2].map((k) => (
        <ellipse
          key={k}
          cx={430}
          cy={100}
          rx={70 * r(k)}
          ry={16 * r(k)}
          fill="none"
          stroke="#fff"
          strokeWidth={4}
          opacity={(1 - r(k)) * (0.9 + ripple)}
        />
      ))}
      <ellipse cx={180} cy={110} rx={34} ry={13} fill="#8CCB7E" />
      <ellipse cx={540} cy={92} rx={28} ry={11} fill="#8CCB7E" />
    </>,
  );
};

export const Manzano: React.FC = () =>
  svg(
    "0 0 600 760",
    <>
      <rect x={265} y={380} width={70} height={380} rx={35} fill={c.tronco} />
      <circle cx={300} cy={260} r={230} fill={c.copa} />
      <circle cx={170} cy={330} r={130} fill={c.copa} />
      <circle cx={440} cy={320} r={130} fill={c.copa} />
      <circle cx={230} cy={170} r={90} fill={c.copaClara} opacity={0.6} />
      {[
        [190, 380],
        [420, 400],
        [330, 150],
        [130, 260],
        [470, 230],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x - 9} cy={y} r={20} fill={c.rojo} />
          <circle cx={x + 9} cy={y} r={20} fill={c.rojo} />
        </g>
      ))}
    </>,
  );

export const Arcoiris: React.FC<{ progress: number }> = ({ progress }) =>
  svg(
    "0 0 640 360",
    <>
      {[
        [250, c.rojo],
        [195, c.amarillo],
        [140, c.azul],
      ].map(([r, color], i) => {
        const p = Math.max(0, Math.min(1, progress * 1.4 - i * 0.2));
        return (
          <path
            key={String(color)}
            d={`M${320 - Number(r)} 330 A${r} ${r} 0 0 1 ${320 + Number(r)} 330`}
            stroke={String(color)}
            strokeWidth={52}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
          />
        );
      })}
      <g opacity={Math.min(1, progress * 2)}>
        <Nubecita x={90} y={322} s={0.55} />
        <Nubecita x={550} y={322} s={0.55} />
      </g>
    </>,
  );

// Brillitos que aparecen y se desvanecen alrededor de un punto (después de "¡Muy bien!")
export const Brillitos: React.FC<{ x: number; y: number; at: number; radius?: number; color?: string }> = ({
  x,
  y,
  at,
  radius = 220,
  color = "#FFF3B0",
}) => {
  const { t } = useTime();
  const p = (t - at) / 1.6;
  if (p < 0 || p > 1) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3;
        const d = radius * (0.6 + 0.5 * p);
        const s = 18 * Math.sin(Math.PI * p);
        const cx = x + d * Math.cos(a);
        const cy = y + d * Math.sin(a);
        return (
          <path
            key={i}
            d={`M${cx} ${cy - s} Q${cx} ${cy} ${cx + s} ${cy} Q${cx} ${cy} ${cx} ${cy + s} Q${cx} ${cy} ${cx - s} ${cy} Q${cx} ${cy} ${cx} ${cy - s} Z`}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
          />
        );
      })}
    </svg>
  );
};
