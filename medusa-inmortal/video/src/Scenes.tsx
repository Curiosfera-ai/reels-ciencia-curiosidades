import type React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene } from "./components/Layout";
import { Medusa } from "./components/Medusa";
import { Polyp } from "./components/Polyp";
import { Words } from "./components/Words";
import { colors, fonts } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 1 · Hook (0.0–3.0 s)
export const Hook: React.FC = () => (
  <Scene tint={colors.cyan} visual={<Medusa size={420} />}>
    <Words words={[{ text: "Este" }, { text: "animal" }, { text: "es" }]} size={84} stagger={2} />
    <Words words={[{ text: "prácticamente" }]} size={84} delay={4} />
    <Words words={[{ text: "INMORTAL", accent: true, color: colors.cyan, size: 210 }]} delay={10} />
    <Words words={[{ text: "¿Cómo" }, { text: "lo" }, { text: "hace?" }].map((w) => ({ ...w, color: colors.yellow }))} size={66} delay={60} />
  </Scene>
);

// 2 · Nombre (3.0–5.5 s): el nombre científico se escribe letra por letra
const Typed: React.FC<{ readonly text: string; readonly start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.body,
        fontStyle: "italic",
        fontWeight: 800,
        fontSize: 128,
        color: colors.cyan,
        textShadow: `0 0 40px ${colors.cyan}88`,
        lineHeight: 1.05,
      }}
    >
      {text.split("").map((ch, i) => (
        <span key={i} style={{ opacity: frame >= start + i * 1.4 ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

export const Name: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene
      tint={colors.magenta}
      visual={<Medusa size={360} phase={40} style={{ translate: `${Math.sin(frame / 20) * 30}px 0px`, rotate: `${Math.sin(frame / 25) * 6}deg` }} />}
    >
      <Typed text="Turritopsis" start={1} />
      <Typed text="dohrnii" start={16} />
      <Words words={[{ text: "la" }, { text: "medusa" }, { text: "inmortal" }].map((w) => ({ ...w, color: colors.muted }))} size={54} delay={34} />
    </Scene>
  );
};

// 3 · Tamaño (5.5–8.0 s): contador 0 → 4,5 mm, sincronizado con ticks.wav
export const Size: React.FC = () => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [3, 36], [0, 4.5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const line = interpolate(frame, [3, 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Scene
      tint={colors.yellow}
      visual={
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 330, height: 40, marginBottom: -10 }}>
            <div style={{ position: "absolute", left: 0, top: 6, width: 4, height: 30, backgroundColor: colors.yellow }} />
            <div style={{ position: "absolute", right: 0, top: 6, width: 4, height: 30, backgroundColor: colors.yellow }} />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 19,
                height: 4,
                width: 330,
                backgroundColor: colors.yellow,
                scale: `${line} 1`,
                boxShadow: `0 0 16px ${colors.yellow}`,
              }}
            />
          </div>
          <Medusa size={440} phase={10} />
        </div>
      }
    >
      <Words words={[{ text: "Mide" }, { text: "apenas" }]} size={88} />
      <div
        style={{
          fontFamily: fonts.accent,
          fontSize: 230,
          color: colors.yellow,
          textShadow: `0 0 70px ${colors.yellow}77`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value.toFixed(1).replace(".", ",")} mm
      </div>
    </Scene>
  );
};

// 4 · Envejece (8.0–10.5 s): la medusa pierde el color
export const Aging: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene
      tint={colors.magenta}
      visual={<Medusa size={420} pulseSpeed={0.55} phase={5} desaturate={interpolate(frame, [0, 50], [0, 1], clamp)} glow="#556" />}
    >
      <Words words={[{ text: "Cuando" }, { text: "envejece", color: colors.magenta }]} size={96} />
      <Words words={[{ text: "o" }, { text: "se" }, { text: "lastima…", color: colors.magenta }]} size={96} delay={14} />
    </Scene>
  );
};

// 5 · No muere (10.5–13.0 s): se hunde y recoge los tentáculos
export const Sinks: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 60], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Scene
      tint={colors.cyan}
      visual={
        <Medusa
          size={420}
          pulseSpeed={0.4}
          retract={p}
          desaturate={1 - p * 0.4}
          glow="#557"
          style={{ translate: `0px ${p * 170}px`, scale: String(1 - p * 0.35) }}
        />
      }
    >
      <Words words={[{ text: "…no", accent: true, color: colors.cyan }, { text: "muere.", accent: true, color: colors.cyan }]} size={170} />
      <Words words={[{ text: "Se" }, { text: "hunde" }, { text: "y" }, { text: "se" }, { text: "encoge." }]} size={74} delay={18} stagger={2} />
    </Scene>
  );
};

// 6 · Quiste (13.0–15.5 s): queda una bolita de células
const Cyst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame, fps, config: { damping: 11, stiffness: 140 } });
  const wobble = (k: number) => 1 + Math.sin(frame * 0.18 + k) * 0.04;
  return (
    <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ overflow: "visible", scale: String(grow) }}>
      <defs>
        <radialGradient id="cyst" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFB09A" />
          <stop offset="55%" stopColor={colors.red} />
          <stop offset="100%" stopColor="#8E1F2A" />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={0} rx={160 * wobble(0)} ry={150 * wobble(2)} fill="url(#cyst)" style={{ filter: `drop-shadow(0 0 40px ${colors.red})` }} />
      {Array.from({ length: 26 }, (_, i) => {
        const a = i * 2.4;
        const r = 30 + ((i * 37) % 100);
        return (
          <circle
            key={i}
            cx={Math.cos(a + frame * 0.01) * r}
            cy={Math.sin(a + frame * 0.01) * r * 0.92}
            r={13 + (i % 3) * 3}
            fill="#FFD3C7"
            opacity={0.55}
          />
        );
      })}
    </svg>
  );
};

export const CystScene: React.FC = () => (
  <Scene tint={colors.red} visual={<Cyst />}>
    <Words words={[{ text: "Se" }, { text: "vuelve" }, { text: "una" }]} size={92} />
    <Words words={[{ text: "bolita" }, { text: "de" }, { text: "células", color: colors.yellow }]} size={92} delay={10} />
  </Scene>
);

// 7 · Clímax (15.5–18.5 s): las células cambian de tipo
const Cells: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 120px)", gridAutoRows: "120px", placeItems: "center" }}>
      {Array.from({ length: 20 }, (_, i) => {
        const start = 8 + ((i * 7) % 20);
        const p = interpolate(frame, [start, start + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
        const tall = i % 3 === 0;
        const wide = i % 3 === 1;
        return (
          <div
            key={i}
            style={{
              width: interpolate(p, [0, 1], [74, tall ? 34 : wide ? 108 : 80]),
              height: interpolate(p, [0, 1], [74, tall ? 108 : wide ? 34 : 56]),
              borderRadius: interpolate(p, [0, 1], [37, 14]),
              backgroundColor: p < 0.5 ? colors.red : colors.magenta,
              boxShadow: `0 0 ${20 + p * 20}px ${p < 0.5 ? colors.red : colors.magenta}`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

export const Transdifferentiation: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Scene tint={colors.magenta} visual={<Cells />}>
      <Words words={[{ text: "Sus" }, { text: "células" }]} size={80} />
      <Words words={[{ text: "cambian" }, { text: "de" }, { text: "tipo:" }]} size={80} delay={6} />
      <Words words={[{ text: "TRANSDIFERENCIACIÓN", accent: true, color: colors.magenta, size: 98 }]} delay={20} />
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: interpolate(frame, [20, 21, 30], [0, 0.55, 0], clamp),
          pointerEvents: "none",
        }}
      />
    </Scene>
  );
};

// 8 · Pólipo (18.5–21.0 s): el ciclo de vida va hacia atrás
export const BackToPolyp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrow = interpolate(frame, [0, 22], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const grow = spring({ frame: frame - 12, fps, config: { damping: 14 } });
  return (
    <Scene
      tint={colors.cyan}
      visual={
        <div style={{ position: "relative", width: 900, height: 620 }}>
          <svg width={900} height={620} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <defs>
              <marker id="head" markerWidth={3.2} markerHeight={3.2} refX={1.2} refY={1.6} orient="auto">
                <path d="M 0 0 L 3.2 1.6 L 0 3.2 Z" fill={colors.cyan} />
              </marker>
            </defs>
            <path
              d="M 660 200 C 600 20, 300 20, 240 230"
              fill="none"
              stroke={colors.cyan}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={700}
              strokeDashoffset={700 * arrow}
              markerEnd={arrow < 0.05 ? "url(#head)" : undefined}
              style={{ filter: `drop-shadow(0 0 12px ${colors.cyan})` }}
            />
          </svg>
          <div style={{ position: "absolute", left: 600, top: 190, opacity: interpolate(frame, [0, 30], [1, 0.35], clamp) }}>
            <Medusa size={200} glow="#557" desaturate={0.5} />
          </div>
          <div style={{ position: "absolute", left: 150, top: 230 }}>
            <Polyp height={380} grow={grow} />
          </div>
        </div>
      }
    >
      <Words words={[{ text: "Y" }, { text: "vuelve" }, { text: "a" }, { text: "ser" }, { text: "un" }]} size={80} stagger={2} />
      <Words words={[{ text: "PÓLIPO", accent: true, color: colors.cyan, size: 200 }]} delay={10} />
      <Words words={[{ text: "juvenil" }]} size={80} delay={16} />
    </Scene>
  );
};

// 9 · Brotes (21.0–23.0 s): del pólipo salen medusas nuevas
const Bud: React.FC<{ readonly start: number; readonly x: number }> = ({ start, x }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 40], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: x - 55,
        top: 190,
        opacity: interpolate(frame, [start, start + 4], [0, 1], clamp),
        translate: `0px ${-p * 230}px`,
        scale: String(0.4 + p * 0.6),
      }}
    >
      <Medusa size={110} phase={start * 3} />
    </div>
  );
};

export const Budding: React.FC = () => (
  <Scene
    tint={colors.cyan}
    visual={
      <div style={{ position: "relative", width: 900, height: 620 }}>
        <div style={{ position: "absolute", left: 140, right: 140, top: 548, height: 10, borderRadius: 5, backgroundColor: "#F2C6B4" }} />
        <div style={{ position: "absolute", left: 210, top: 180 }}>
          <Polyp height={380} phase={0} />
        </div>
        <div style={{ position: "absolute", left: 355, top: 180 }}>
          <Polyp height={380} phase={2} />
        </div>
        <div style={{ position: "absolute", left: 500, top: 180 }}>
          <Polyp height={380} phase={4} />
        </div>
        <Bud start={8} x={305} />
        <Bud start={18} x={450} />
        <Bud start={28} x={595} />
      </div>
    }
  >
    <Words words={[{ text: "Del" }, { text: "pólipo" }, { text: "brotan" }]} size={88} />
    <Words words={[{ text: "medusas", color: colors.cyan }, { text: "nuevas", color: colors.cyan }]} size={110} delay={10} />
  </Scene>
);

// 10 · Cierre (23.0–25.0 s): ciclo en loop y remate honesto
export const Loop: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = interpolate(frame, [30, 32, 44], [0, 1, 0], clamp);
  return (
    <Scene
      tint={frame >= 30 ? colors.red : colors.cyan}
      visual={
        <div style={{ position: "relative", width: 560, height: 560, rotate: `${frame * 3}deg`, translate: `${Math.sin(frame * 3) * 14 * hit}px 0px` }}>
          {/* Ciclo: medusa (arriba) → quiste (abajo a la derecha) → pólipo (abajo a la izquierda) */}
          <svg width={560} height={560} viewBox="-280 -280 560 560" style={{ position: "absolute", inset: 0 }}>
            <circle r={220} fill="none" stroke={colors.cyan} strokeOpacity={0.5} strokeWidth={6} strokeDasharray="30 18" />
            {[60, 180, 300].map((a) => (
              <path key={a} d="M -14 -238 L 16 -220 L -14 -202 Z" fill={colors.cyan} transform={`rotate(${a})`} />
            ))}
          </svg>
          <div style={{ position: "absolute", left: 210, top: -31, rotate: `${-frame * 3}deg` }}>
            <Medusa size={140} />
          </div>
          <div style={{ position: "absolute", left: 425, top: 345, width: 90, height: 90, borderRadius: "50%", background: colors.red, boxShadow: `0 0 30px ${colors.red}` }} />
          <div style={{ position: "absolute", left: 42, top: 295, rotate: `${-frame * 3}deg` }}>
            <Polyp height={190} />
          </div>
        </div>
      }
    >
      <Words words={[{ text: "Una" }, { text: "y" }, { text: "otra" }, { text: "vez…" }]} size={96} stagger={2} />
      <Words
        words={[{ text: "si" }, { text: "no" }, { text: "se" }, { text: "la" }, { text: "comen" }].map((w) => ({ ...w, color: colors.yellow }))}
        size={100}
        delay={30}
        stagger={1}
      />
    </Scene>
  );
};
