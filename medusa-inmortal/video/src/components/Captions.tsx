import type React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";
import { captionChunks, type SceneId } from "../voice";

// Subtítulos karaoke: el texto exacto de la voz, se ilumina la palabra que se está diciendo
export const Captions: React.FC<{ readonly id: SceneId; readonly accent?: string }> = ({ id, accent = colors.yellow }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = captionChunks(id, fps);
  let index = 0;
  chunks.forEach((c, i) => {
    if (frame >= c[0].start - 2) index = i;
  });
  const chunk = chunks[index];
  const enter = index === 0 ? 0 : chunk[0].start - 2;
  // En la primera placa arranca invisible: el frame 0 tiene que ser igual al último (loop)
  const appear = interpolate(frame, [enter, enter + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 26,
        rowGap: 2,
        opacity: appear,
        translate: `0px ${(1 - appear) * 14}px`,
      }}
    >
      {chunk.map((w, i) => {
        const said = frame >= w.start;
        const now = said && frame < w.end + 2;
        return (
          <span
            key={i}
            style={{
              fontFamily: fonts.body,
              fontWeight: 800,
              fontSize: 58,
              lineHeight: 1.18,
              color: now ? accent : said ? colors.white : "rgba(244,247,251,0.38)",
              textShadow: "0 3px 18px #000c",
              scale: now ? "1.06" : "1",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
