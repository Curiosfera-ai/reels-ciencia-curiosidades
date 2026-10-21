import type React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Fondo oscuro con un halo de color por escena y "nieve marina" que sube lento.
// `offset` desplaza el tiempo de las partículas (para que el final coincida con el inicio).
export const Background: React.FC<{ readonly tint: string; readonly offset?: number }> = ({ tint, offset = 0 }) => {
  const frame = useCurrentFrame() + offset;
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 30%, ${tint}38 0%, ${tint}10 35%, transparent 65%)`,
        }}
      />
      {Array.from({ length: 45 }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 0.4 + random(`s${i}`) * 1.2;
        const y = (((random(`y${i}`) * height - frame * speed) % height) + height) % height;
        const r = 1.5 + random(`r${i}`) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              backgroundColor: "#CFEFFF",
              opacity: 0.12 + random(`o${i}`) * 0.25,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Zona visual arriba (260–880 px) y texto abajo (920–1500 px):
// deja libres los bordes que tapan los controles de Instagram/TikTok
export const Scene: React.FC<{
  readonly tint: string;
  readonly visual: React.ReactNode;
  readonly children: React.ReactNode;
  readonly punch?: boolean; // pequeño zoom de entrada en el corte
  readonly bgOffset?: number;
  readonly textOpacity?: number;
}> = ({ tint, visual, children, punch = true, bgOffset = 0, textOpacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint={tint} offset={bgOffset} />
      <AbsoluteFill
        style={{
          scale: punch
            ? interpolate(frame, [0, 8], [1.06, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              })
            : 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 260,
            left: 0,
            right: 0,
            height: 620,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {visual}
        </div>
        <div
          style={{
            position: "absolute",
            top: 920,
            left: 80,
            right: 80,
            height: 580,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
            textAlign: "center",
            opacity: textOpacity,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
