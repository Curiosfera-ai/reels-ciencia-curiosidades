import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Siluetas simples, de un solo color, para la placa "casi todos los animales"
type IconProps = { readonly size: number; readonly color: string };

export const FishIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
    <ellipse cx={90} cy={60} rx={70} ry={38} fill={color} />
    <polygon points="150,60 196,24 196,96" fill={color} />
    <circle cx={52} cy={50} r={7} fill={colors.bg} />
  </svg>
);

export const BirdIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
    <polygon points="50,90 8,72 20,112" fill={color} />
    <ellipse cx={100} cy={95} rx={56} ry={38} fill={color} />
    <circle cx={150} cy={58} r={25} fill={color} />
    <polygon points="172,54 198,64 172,72" fill={colors.yellow} />
    <circle cx={156} cy={52} r={5} fill={colors.bg} />
    <path d="M 70 88 Q 108 40 132 92 Z" fill={colors.bg} opacity={0.25} />
    <line x1={90} y1={130} x2={84} y2={156} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <line x1={112} y1={130} x2={114} y2={156} stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const DogIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size * 0.73} viewBox="0 0 220 160">
    <path d="M 44 74 Q 14 52 26 26" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
    <rect x={40} y={62} width={124} height={50} rx={25} fill={color} />
    {[52, 78, 130, 152].map((x) => (
      <rect key={x} x={x} y={98} width={15} height={56} rx={7} fill={color} />
    ))}
    <circle cx={172} cy={56} r={30} fill={color} />
    <ellipse cx={198} cy={66} rx={16} ry={11} fill={color} />
    <ellipse cx={158} cy={42} rx={11} ry={20} fill={colors.bg} opacity={0.25} />
    <circle cx={178} cy={48} r={5} fill={colors.bg} />
  </svg>
);

export const HumanIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size * 0.55} height={size} viewBox="0 0 120 220">
    <circle cx={60} cy={30} r={25} fill={color} />
    <rect x={32} y={60} width={56} height={92} rx={24} fill={color} />
    <rect x={12} y={68} width={17} height={74} rx={8} fill={color} />
    <rect x={91} y={68} width={17} height={74} rx={8} fill={color} />
    <rect x={36} y={136} width={21} height={80} rx={10} fill={color} />
    <rect x={63} y={136} width={21} height={80} rx={10} fill={color} />
  </svg>
);

// Reloj con las agujas girando rápido (envejecer)
export const Clock: React.FC<{ readonly size: number; readonly speed: number }> = ({ size, speed }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120">
      <circle r={52} fill="none" stroke={colors.magenta} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={0} y1={-44} x2={0} y2={-38} stroke={colors.magenta} strokeWidth={4} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-26} stroke={colors.white} strokeWidth={6} strokeLinecap="round" transform={`rotate(${frame * speed * 0.08})`} />
      <line x1={0} y1={0} x2={0} y2={-38} stroke={colors.white} strokeWidth={4} strokeLinecap="round" transform={`rotate(${frame * speed})`} />
      <circle r={5} fill={colors.white} />
    </svg>
  );
};

// Doble hélice de ADN (genéticamente idénticas)
export const Helix: React.FC<{ readonly width: number }> = ({ width }) => {
  const frame = useCurrentFrame();
  const rungs = 14;
  const a: string[] = [];
  const b: string[] = [];
  for (let x = 0; x <= width; x += 6) {
    const ph = (x / width) * Math.PI * 4 + frame * 0.12;
    a.push(`${x},${50 + Math.sin(ph) * 34}`);
    b.push(`${x},${50 - Math.sin(ph) * 34}`);
  }
  return (
    <svg width={width} height={100} style={{ overflow: "visible", filter: `drop-shadow(0 0 10px ${colors.cyan})` }}>
      {Array.from({ length: rungs }, (_, i) => {
        const x = ((i + 0.5) / rungs) * width;
        const ph = (x / width) * Math.PI * 4 + frame * 0.12;
        return <line key={i} x1={x} y1={50 + Math.sin(ph) * 34} x2={x} y2={50 - Math.sin(ph) * 34} stroke={colors.white} strokeOpacity={0.45} strokeWidth={4} />;
      })}
      <polyline points={a.join(" ")} fill="none" stroke={colors.cyan} strokeWidth={7} strokeLinecap="round" />
      <polyline points={b.join(" ")} fill="none" stroke={colors.magenta} strokeWidth={7} strokeLinecap="round" />
    </svg>
  );
};

// Sombra de un pez grande (mientras nada se la coma)
export const FishShadow: React.FC<{ readonly width: number }> = ({ width }) => (
  <svg width={width} height={width * 0.45} viewBox="0 0 400 180" style={{ filter: "blur(5px)" }}>
    <path d="M 20 90 C 80 10, 230 10, 300 80 L 390 20 L 370 90 L 390 160 L 300 100 C 230 170, 80 170, 20 90 Z" fill="#000" />
    <path d="M 140 40 L 190 -10 L 220 45 Z" fill="#000" />
  </svg>
);

// Ícono de rebobinar ⏪ dibujado (no depende de fuentes de emoji)
export const RewindIcon: React.FC<{ readonly size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
    <polygon points="50,0 50,60 0,30" fill={colors.white} />
    <polygon points="100,0 100,60 50,30" fill={colors.white} />
  </svg>
);
