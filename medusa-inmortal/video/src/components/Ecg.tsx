import type React from "react";
import { useCurrentFrame } from "remotion";

// Línea de latido (electrocardiograma) que se desplaza; amplitude 0 = línea plana
export const Ecg: React.FC<{
  readonly width: number;
  readonly amplitude: number;
  readonly color: string;
  readonly opacity?: number;
}> = ({ width, amplitude, color, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const period = 220;
  const scroll = frame * 5;
  const points: string[] = [];
  for (let x = 0; x <= width; x += 3) {
    const l = (((x + scroll) % period) + period) % period;
    let y = 0;
    if (l >= 40 && l < 60) y = -10 * Math.sin((Math.PI * (l - 40)) / 20);
    else if (l >= 70 && l < 75) y = 10 * ((l - 70) / 5);
    else if (l >= 75 && l < 85) y = -75 * (1 - Math.abs(l - 80) / 5);
    else if (l >= 85 && l < 92) y = 22 * (1 - Math.abs(l - 88.5) / 3.5);
    else if (l >= 110 && l < 140) y = -16 * Math.sin((Math.PI * (l - 110)) / 30);
    points.push(`${x},${(90 + y * amplitude).toFixed(1)}`);
  }
  return (
    <svg width={width} height={180} style={{ overflow: "visible", opacity, filter: `drop-shadow(0 0 10px ${color})` }}>
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};
