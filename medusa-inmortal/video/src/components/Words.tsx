import type React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

export type Word = {
  readonly text: string;
  readonly color?: string;
  readonly accent?: boolean;
  readonly italic?: boolean;
  readonly size?: number;
};

// Una línea de texto cinético: cada palabra entra con un pequeño rebote
export const Words: React.FC<{
  readonly words: Word[];
  readonly delay?: number;
  readonly stagger?: number;
  readonly size?: number;
}> = ({ words, delay = 0, stagger = 3, size = 92 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: size * 0.28,
        lineHeight: 1.05,
      }}
    >
      {words.map((w, i) => {
        const p = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: { damping: 13, stiffness: 190, mass: 0.7 },
        });
        const wordSize = w.size ?? size;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: w.accent ? fonts.accent : fonts.body,
              fontWeight: w.accent ? 400 : 900,
              fontStyle: w.italic ? "italic" : "normal",
              fontSize: wordSize,
              letterSpacing: w.accent ? 1 : -1,
              color: w.color ?? colors.white,
              textShadow: w.color ? `0 0 ${wordSize * 0.35}px ${w.color}88` : "0 4px 24px #000a",
              opacity: Math.min(1, p * 1.6),
              translate: `0px ${(1 - p) * 50}px`,
              scale: String(0.8 + 0.2 * p),
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
