import type React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";
import type { SceneId } from "../voice";
import { Captions } from "./Captions";

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

// Zonas: imagen (260–900 px), palabra clave (900–1220 px) y subtítulos (1235–1480 px).
// Deja libres los bordes que tapan los controles de Instagram/TikTok.
export const Scene: React.FC<{
  readonly tint: string;
  readonly visual: React.ReactNode;
  readonly children?: React.ReactNode; // palabra clave grande
  readonly captions?: SceneId;
  readonly camera?: React.CSSProperties; // movimiento de cámara sobre la imagen
  readonly backdrop?: React.ReactNode; // capa entre el fondo y el contenido
  readonly foreground?: React.ReactNode; // capa por encima de todo
  readonly punch?: boolean; // pequeño zoom de entrada en el corte
  readonly bgOffset?: number;
  readonly textOpacity?: number;
}> = ({ tint, visual, children, captions, camera, backdrop, foreground, punch = true, bgOffset = 0, textOpacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint={tint} offset={bgOffset} />
      {backdrop ? <AbsoluteFill>{backdrop}</AbsoluteFill> : null}
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
            height: 640,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            ...camera,
          }}
        >
          {visual}
        </div>
        <div
          style={{
            position: "absolute",
            top: 900,
            left: 80,
            right: 80,
            height: 320,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 14,
            textAlign: "center",
            opacity: textOpacity,
          }}
        >
          {children}
        </div>
        {captions ? (
          <div style={{ position: "absolute", top: 1235, left: 70, right: 70, height: 245, opacity: textOpacity }}>
            <Captions id={captions} />
          </div>
        ) : null}
      </AbsoluteFill>
      {foreground ? <AbsoluteFill style={{ pointerEvents: "none" }}>{foreground}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
