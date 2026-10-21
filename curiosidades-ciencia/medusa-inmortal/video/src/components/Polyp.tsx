import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Pólipo: tallo fijo al fondo con una cabeza (hidranto) y corona de tentáculos
export const Polyp: React.FC<{
  readonly height: number;
  readonly grow?: number; // 0..1
  readonly phase?: number;
}> = ({ height, grow = 1, phase = 0 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.08 + phase) * 10;
  const stalk = 260 * grow;
  const headY = 300 - stalk;
  const headX = sway * grow;

  return (
    <svg width={height * 0.5} height={height} viewBox="-100 -60 200 400" style={{ overflow: "visible" }}>
      <path
        d={`M 0 300 Q ${sway * 0.4} ${300 - stalk / 2} ${headX} ${headY}`}
        fill="none"
        stroke="#F2C6B4"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <g transform={`translate(${headX} ${headY}) scale(${grow})`}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = -Math.PI + (Math.PI * i) / 10;
          const wob = Math.sin(frame * 0.15 + i + phase) * 0.12;
          return (
            <line
              key={i}
              x1={0}
              y1={-30}
              x2={Math.cos(a + wob) * 62}
              y2={-30 + Math.sin(a + wob) * 62}
              stroke="#FFD8CC"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
        <path d="M -24 -28 C -30 10, -12 20, 0 22 C 12 20, 30 10, 24 -28 Z" fill={colors.red} />
      </g>
      <ellipse cx={0} cy={302} rx={40} ry={8} fill="#F2C6B4" opacity={0.5} />
    </svg>
  );
};
