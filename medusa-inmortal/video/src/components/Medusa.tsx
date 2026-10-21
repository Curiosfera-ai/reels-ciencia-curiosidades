import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";

const TENTACLES = 16;

// Turritopsis estilizada: campana translúcida con el estómago rojo característico
export const Medusa: React.FC<{
  readonly size: number;
  readonly retract?: number; // 0 = tentáculos extendidos, 1 = recogidos
  readonly desaturate?: number; // 0 = color, 1 = gris apagado
  readonly pulseSpeed?: number;
  readonly phase?: number;
  readonly glow?: string;
  readonly style?: React.CSSProperties;
}> = ({ size, retract = 0, desaturate = 0, pulseSpeed = 1, phase = 0, glow = colors.cyan, style }) => {
  const frame = useCurrentFrame();
  const t = frame * pulseSpeed + phase;
  // Contracción rápida y relajación lenta, como el nado real
  const cycle = (t % 36) / 36;
  const pulse = cycle < 0.3 ? Math.sin((cycle / 0.3) * (Math.PI / 2)) : Math.cos(((cycle - 0.3) / 0.7) * (Math.PI / 2));
  const sx = 1 - 0.09 * pulse;
  const sy = 1 + 0.07 * pulse;
  const length = 250 * (1 - retract * 0.88);

  const tentacles = Array.from({ length: TENTACLES }, (_, i) => {
    const x0 = -138 + (276 * i) / (TENTACLES - 1);
    const points: string[] = [];
    for (let k = 0; k <= 12; k++) {
      const p = k / 12;
      const y = 62 + p * length;
      const sway = Math.sin(p * 5 + t * 0.12 + i * 0.9) * 16 * p;
      const pinch = x0 * (0.1 * pulse * p);
      points.push(`${(x0 * (1 - 0.15 * p) + sway - pinch).toFixed(1)},${y.toFixed(1)}`);
    }
    return <polyline key={i} points={points.join(" ")} fill="none" stroke="#BFF6FF" strokeOpacity={0.55} strokeWidth={2.4} strokeLinecap="round" />;
  });

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="-200 -130 400 520"
      style={{
        overflow: "visible",
        filter: `drop-shadow(0 0 ${size * 0.06}px ${glow}) grayscale(${desaturate}) brightness(${1 - desaturate * 0.45})`,
        ...style,
      }}
    >
      <defs>
        <radialGradient id="bell" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#D8FBFF" stopOpacity={0.75} />
          <stop offset="60%" stopColor="#6FDCF5" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#2AA9D8" stopOpacity={0.2} />
        </radialGradient>
      </defs>
      {tentacles}
      <g transform={`scale(${sx} ${sy})`}>
        <path d="M -150 60 C -150 -115, 150 -115, 150 60 C 100 80, -100 80, -150 60 Z" fill="url(#bell)" stroke="#A8F4FF" strokeWidth={3} />
        {[-70, -25, 25, 70].map((x) => (
          <path key={x} d={`M 0 10 Q ${x * 0.6} -30 ${x * 1.9} 66`} fill="none" stroke="#FF8E7A" strokeOpacity={0.6} strokeWidth={3} />
        ))}
        <ellipse cx={0} cy={8} rx={42} ry={36} fill={colors.red} opacity={0.92} />
        <ellipse cx={-12} cy={-4} rx={14} ry={10} fill="#FFB0A3" opacity={0.6} />
        <path d="M -16 40 Q 0 100 16 40 Z" fill={colors.red} opacity={0.8} />
      </g>
    </svg>
  );
};
