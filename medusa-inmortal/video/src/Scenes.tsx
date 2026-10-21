import type React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene } from "./components/Layout";
import { Medusa } from "./components/Medusa";
import { Polyp } from "./components/Polyp";
import { Words } from "./components/Words";
import { colors, fonts } from "./theme";
import { cue, HOOK_TAIL, OUTRO } from "./voice";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cada placa recibe su duración en frames; el texto entra cuando la voz dice la palabra clave
type Props = { readonly dur: number };

// 1 · Hook — "Este animal es prácticamente inmortal."
// Sin zoom de entrada: el frame 0 tiene que coincidir con el último (loop).
export const Hook: React.FC<Props> = ({ dur }) => {
  const { fps } = useVideoConfig();
  return (
    <Scene tint={colors.cyan} punch={false} visual={<Medusa size={420} />}>
      <Words words={[{ text: "Este" }, { text: "animal" }, { text: "es" }]} size={84} stagger={Math.round(0.33 * fps)} delay={cue("01-hook", "este", fps)} />
      <Words words={[{ text: "prácticamente" }]} size={84} delay={cue("01-hook", "practicamente", fps)} />
      <Words words={[{ text: "INMORTAL", accent: true, color: colors.cyan, size: 210 }]} delay={cue("01-hook", "inmortal", fps)} />
      <Words
        words={[{ text: "¿Cómo" }, { text: "lo" }, { text: "hace?" }].map((w) => ({ ...w, color: colors.yellow }))}
        size={66}
        delay={dur - HOOK_TAIL + 2}
      />
    </Scene>
  );
};

// 2 · Nombre — "Se llama Turritopsis dohrnii…"
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
        <span key={i} style={{ opacity: frame >= start + i * 1.2 ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

export const Name: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = cue("02-nombre", "turritopsis", fps);
  return (
    <Scene
      tint={colors.magenta}
      visual={<Medusa size={360} phase={40} style={{ translate: `${Math.sin(frame / 20) * 30}px 0px`, rotate: `${Math.sin(frame / 25) * 6}deg` }} />}
    >
      <Typed text="Turritopsis" start={start} />
      <Typed text="dohrnii" start={cue("02-nombre", "dornii", fps)} />
    </Scene>
  );
};

// 3 · Tamaño — "…y es una medusa diminuta: apenas cuatro milímetros y medio."
export const Size: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const from = cue("03-tamano", "cuatro", fps);
  const to = cue("03-tamano", "medio", fps, "end");
  const value = interpolate(frame, [from, to], [0, 4.5], { ...clamp, easing: Easing.out(Easing.cubic) });
  const line = interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Scene
      tint={colors.yellow}
      visual={
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 330, height: 40, marginBottom: -10 }}>
            <div style={{ position: "absolute", left: 0, top: 6, width: 4, height: 30, backgroundColor: colors.yellow, opacity: line > 0 ? 1 : 0 }} />
            <div style={{ position: "absolute", right: 0, top: 6, width: 4, height: 30, backgroundColor: colors.yellow, opacity: line > 0 ? 1 : 0 }} />
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
          <Medusa size={440} phase={10} style={{ scale: String(interpolate(frame, [0, from], [1.15, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })) }} />
        </div>
      }
    >
      <Words words={[{ text: "Diminuta:" }]} size={84} delay={cue("03-tamano", "diminuta", fps)} />
      <div
        style={{
          fontFamily: fonts.accent,
          fontSize: 230,
          color: colors.yellow,
          textShadow: `0 0 70px ${colors.yellow}77`,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          opacity: interpolate(frame, [from - 4, from], [0, 1], clamp),
        }}
      >
        {value.toFixed(1).replace(".", ",")} mm
      </div>
    </Scene>
  );
};

// 4 · Envejece — "Para casi todos los animales, envejecer o lastimarse es el principio del fin."
export const Aging: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = cue("04-envejece", "envejecer", fps);
  return (
    <Scene
      tint={colors.magenta}
      visual={<Medusa size={420} pulseSpeed={0.55} phase={5} desaturate={interpolate(frame, [start, dur], [0, 1], clamp)} glow="#556" />}
    >
      <Words words={[{ text: "Envejecer…", color: colors.magenta }]} size={92} delay={start} />
      <Words words={[{ text: "lastimarse…", color: colors.magenta }]} size={92} delay={cue("04-envejece", "lastimarse", fps)} />
      <Words
        words={[{ text: "el" }, { text: "principio" }, { text: "del" }, { text: "FIN", accent: true, color: colors.white, size: 130 }]}
        size={76}
        stagger={Math.round(0.15 * fps)}
        delay={cue("04-envejece", "principio", fps) - 4}
      />
    </Scene>
  );
};

// 5 · No muere — "Pero ella hace algo distinto. En lugar de morir… se hunde, y se encoge."
export const Sinks: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sink = cue("05-no-muere", "hunde", fps);
  const p = interpolate(frame, [sink, dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
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
      <Words words={[{ text: "…no", accent: true, color: colors.cyan }, { text: "muere.", accent: true, color: colors.cyan }]} size={170} delay={cue("05-no-muere", "lugar", fps)} />
      <Words words={[{ text: "Se" }, { text: "hunde" }]} size={80} delay={sink - 3} stagger={2} />
      <Words words={[{ text: "y" }, { text: "se" }, { text: "encoge." }]} size={80} delay={cue("05-no-muere", "encoge", fps) - 6} stagger={2} />
    </Scene>
  );
};

// 6 · Quiste — "Su cuerpo se reduce a una pequeña bolita de células."
const Cyst: React.FC<{ readonly start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 140 } });
  const wobble = (k: number) => 1 + Math.sin(frame * 0.18 + k) * 0.04;
  return (
    <div style={{ position: "relative", width: 460, height: 460 }}>
      {/* La medusa ya encogida se funde en la bolita */}
      <div style={{ position: "absolute", left: 230 - 136, top: 60, opacity: interpolate(frame, [0, start + 6], [1, 0], clamp) }}>
        <Medusa size={272} retract={1} desaturate={0.6} glow="#557" pulseSpeed={0.4} />
      </div>
      <svg width={460} height={460} viewBox="-230 -230 460 460" style={{ position: "absolute", inset: 0, overflow: "visible", scale: String(grow) }}>
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
    </div>
  );
};

export const CystScene: React.FC<Props> = () => {
  const { fps } = useVideoConfig();
  return (
    <Scene tint={colors.red} visual={<Cyst start={cue("06-quiste", "reduce", fps)} />}>
      <Words words={[{ text: "Una" }, { text: "bolita" }]} size={96} delay={cue("06-quiste", "bolita", fps) - 4} stagger={2} />
      <Words words={[{ text: "de" }, { text: "células", color: colors.yellow }]} size={96} delay={cue("06-quiste", "celulas", fps) - 4} stagger={2} />
    </Scene>
  );
};

// 7 · Clímax — "Y entonces ocurre la clave: sus células cambian de tipo. Transdiferenciación."
const Cells: React.FC<{ readonly start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 120px)", gridAutoRows: "120px", placeItems: "center" }}>
      {Array.from({ length: 20 }, (_, i) => {
        const s = start + ((i * 7) % 20);
        const p = interpolate(frame, [s, s + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
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

export const Transdifferentiation: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const climax = cue("07-clave", "transdiferenciacion", fps);
  return (
    <>
      <Scene tint={colors.magenta} visual={<Cells start={cue("07-clave", "cambian", fps)} />}>
        <Words words={[{ text: "Sus" }, { text: "células" }]} size={80} delay={cue("07-clave", "sus", fps)} />
        <Words words={[{ text: "cambian" }, { text: "de" }, { text: "tipo:" }]} size={80} delay={cue("07-clave", "cambian", fps)} />
        <Words words={[{ text: "TRANSDIFERENCIACIÓN", accent: true, color: colors.magenta, size: 98 }]} delay={climax} />
      </Scene>
      {/* Destello de pantalla completa en el clímax */}
      <AbsoluteFill
        style={{
          backgroundColor: "white",
          opacity: interpolate(frame, [climax, climax + 1, climax + 10], [0, 0.55, 0], clamp),
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// 8 · Pólipo — "Así vuelve a ser un pólipo, como en su juventud."
export const BackToPolyp: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const back = cue("08-polipo", "vuelve", fps);
  const polyp = cue("08-polipo", "polipo", fps);
  const arrow = interpolate(frame, [back, polyp + 4], [1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const grow = spring({ frame: frame - polyp, fps, config: { damping: 14 } });
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
          <div style={{ position: "absolute", left: 600, top: 190, opacity: interpolate(frame, [back, polyp + 10], [1, 0.35], clamp) }}>
            <Medusa size={200} glow="#557" desaturate={0.5} />
          </div>
          <div style={{ position: "absolute", left: 150, top: 230 }}>
            <Polyp height={380} grow={grow} />
          </div>
        </div>
      }
    >
      <Words words={[{ text: "Vuelve" }, { text: "a" }, { text: "ser" }]} size={84} stagger={2} delay={back} />
      <Words words={[{ text: "PÓLIPO", accent: true, color: colors.cyan, size: 220 }]} delay={polyp} />
    </Scene>
  );
};

// 9 · Brotes — "Y de ese pólipo brotan medusas nuevas, genéticamente idénticas."
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

export const BUD_OFFSETS = [0, 10, 20];

export const Budding: React.FC<Props> = () => {
  const { fps } = useVideoConfig();
  const bud = cue("09-brotes", "brotan", fps);
  return (
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
          <Bud start={bud + BUD_OFFSETS[0]} x={305} />
          <Bud start={bud + BUD_OFFSETS[1]} x={450} />
          <Bud start={bud + BUD_OFFSETS[2]} x={595} />
        </div>
      }
    >
      <Words words={[{ text: "Medusas", color: colors.cyan }, { text: "nuevas", color: colors.cyan }]} size={110} delay={cue("09-brotes", "medusas", fps)} />
      <Words
        words={[{ text: "genéticamente" }, { text: "idénticas" }].map((w) => ({ ...w, color: colors.muted }))}
        size={58}
        delay={cue("09-brotes", "geneticamente", fps)}
      />
    </Scene>
  );
};

// 10 · Cierre — "Una y otra vez… mientras nada se la coma."
// Al terminar la frase, el ciclo y el texto se desvanecen y una medusa nueva sube
// hasta quedar exactamente como en el frame 0 (mismo lugar, tamaño, latido y fondo).
export const Loop: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = dur - OUTRO; // fin de la frase
  const last = dur - 1;
  const settle = interpolate(frame, [end - 6, last - 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fade = interpolate(frame, [end, end + 20], [1, 0], clamp);
  return (
    <Scene
      tint={colors.cyan}
      bgOffset={-last}
      textOpacity={fade}
      visual={
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 30,
              width: 560,
              height: 560,
              rotate: `${frame * 3}deg`,
              opacity: fade,
              scale: String(interpolate(fade, [0, 1], [0.8, 1])),
            }}
          >
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
          {/* La fase hace que en el último frame el latido esté igual que en el frame 0 */}
          <Medusa
            size={420}
            phase={-last}
            style={{
              opacity: interpolate(frame, [end - 6, end + 8], [0, 1], clamp),
              translate: `0px ${(1 - settle) * 320}px`,
              scale: String(0.35 + settle * 0.65),
            }}
          />
        </div>
      }
    >
      <Words words={[{ text: "Una" }, { text: "y" }, { text: "otra" }, { text: "vez…" }]} size={96} stagger={2} delay={cue("10-cierre", "una", fps)} />
      <Words
        words={[{ text: "mientras" }, { text: "nada" }, { text: "se" }, { text: "la" }, { text: "coma" }].map((w) => ({ ...w, color: colors.yellow }))}
        size={66}
        stagger={2}
        delay={cue("10-cierre", "mientras", fps)}
      />
    </Scene>
  );
};
