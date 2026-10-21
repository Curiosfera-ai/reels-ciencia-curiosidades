import type React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Ecg } from "./components/Ecg";
import { BirdIcon, Clock, DogIcon, FishIcon, FishShadow, Helix, HumanIcon, RewindIcon } from "./components/Icons";
import { Scene } from "./components/Layout";
import { Medusa } from "./components/Medusa";
import { Polyp } from "./components/Polyp";
import { Words } from "./components/Words";
import { colors, fonts } from "./theme";
import { cue, HOOK_TAIL, OUTRO } from "./voice";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cada placa recibe su duración en frames; las imágenes entran cuando la voz nombra lo que muestran
type Props = { readonly dur: number };

// 1 · Hook — "Este animal es prácticamente inmortal."
// Sin zoom de entrada y con la cámara en 1 en el frame 0: tiene que coincidir con el último (loop).
export const Hook: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Scene
      tint={colors.cyan}
      punch={false}
      captions="01-hook"
      camera={{ scale: String(interpolate(frame, [0, dur], [1, 1.14], { ...clamp, easing: Easing.inOut(Easing.quad) })) }}
      visual={<Medusa size={420} />}
    >
      <Words words={[{ text: "INMORTAL", accent: true, color: colors.cyan, size: 210 }]} delay={cue("01-hook", "inmortal", fps)} />
      <Words
        words={[{ text: "¿Cómo" }, { text: "lo" }, { text: "hace?" }].map((w) => ({ ...w, color: colors.yellow }))}
        size={66}
        delay={dur - HOOK_TAIL + 2}
      />
    </Scene>
  );
};

// 2 · Nombre — "Se llama Turritopsis dohrnii…": vista de microscopio + etiqueta de museo
const Typed: React.FC<{ readonly text: string; readonly start: number; readonly size: number; readonly color: string }> = ({ text, start, size, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ fontFamily: fonts.body, fontStyle: "italic", fontWeight: 800, fontSize: size, color, lineHeight: 1.1 }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{ opacity: frame >= start + i * 1.1 ? 1 : 0 }}>
          {ch}
        </span>
      ))}
    </div>
  );
};

export const FOCUS_FRAME = 16;

export const Name: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const name = cue("02-nombre", "turritopsis", fps);
  const card = spring({ frame: frame - (name - 6), fps, config: { damping: 12, stiffness: 160 } });
  return (
    <Scene
      tint={colors.cyan}
      captions="02-nombre"
      camera={{ scale: String(interpolate(frame, [0, dur], [1.12, 0.98], clamp)) }}
      visual={
        <div style={{ position: "relative", width: 580, height: 580 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              background: "radial-gradient(circle, #0F3F4A 0%, #071A20 72%)",
              boxShadow: `0 0 0 16px #1B2430, 0 0 0 26px #0B0F15, 0 0 80px ${colors.cyan}44`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                filter: `blur(${interpolate(frame, [0, FOCUS_FRAME], [16, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`,
              }}
            >
              <Medusa size={330} phase={40} />
            </div>
            {/* Retícula del microscopio */}
            <svg width={580} height={580} viewBox="0 0 580 580" style={{ position: "absolute", inset: 0, rotate: `${frame * 0.3}deg` }}>
              <line x1={0} y1={290} x2={580} y2={290} stroke={colors.cyan} strokeOpacity={0.35} strokeWidth={2} />
              <line x1={290} y1={0} x2={290} y2={580} stroke={colors.cyan} strokeOpacity={0.35} strokeWidth={2} />
              {Array.from({ length: 17 }, (_, i) => (
                <line key={i} x1={50 + i * 30} y1={i % 5 === 0 ? 274 : 282} x2={50 + i * 30} y2={i % 5 === 0 ? 306 : 298} stroke={colors.cyan} strokeOpacity={0.5} strokeWidth={2} />
              ))}
            </svg>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 90px 30px #000" }} />
          </div>
        </div>
      }
    >
      {/* Etiqueta de muestra, como en un museo de ciencias */}
      <div
        style={{
          backgroundColor: "#F1E9D2",
          borderRadius: 10,
          padding: "22px 44px 26px",
          rotate: "-3deg",
          boxShadow: "0 18px 40px #000a",
          opacity: Math.min(1, card * 1.5),
          scale: String(0.7 + 0.3 * card),
          textAlign: "left",
        }}
      >
        <Typed text="Turritopsis dohrnii" start={name} size={66} color="#1B1E26" />
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 6,
            color: "#6B6455",
            marginTop: 6,
            opacity: interpolate(frame, [cue("02-nombre", "dornii", fps), cue("02-nombre", "dornii", fps) + 6], [0, 1], clamp),
          }}
        >
          HYDROZOA · MEDUSA
        </div>
      </div>
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
      captions="03-tamano"
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
          <Medusa
            size={440}
            phase={10}
            style={{ scale: String(interpolate(frame, [0, cue("03-tamano", "diminuta", fps) + 10], [1.25, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })) }}
          />
        </div>
      }
    >
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
// Siluetas de animales que envejecen (reloj), una se agrieta, y el latido se apaga.
export const ANIMAL_POP = [2, 9, 16, 23];

export const Aging: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const age = cue("04-envejece", "envejecer", fps);
  const hurt = cue("04-envejece", "lastimarse", fps);
  const end = cue("04-envejece", "principio", fps);
  const aged = interpolate(frame, [age, age + 24], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const crack = interpolate(frame, [hurt, hurt + 6], [1, 0], clamp);
  const redFlash = interpolate(frame, [hurt, hurt + 2, hurt + 14], [0, 1, 0], clamp);
  const dim = interpolate(frame, [end, dur], [1, 0.3], clamp);
  const icons = [
    <FishIcon key="f" size={170} color={colors.white} />,
    <BirdIcon key="b" size={150} color={colors.white} />,
    <DogIcon key="d" size={190} color={colors.white} />,
    <HumanIcon key="h" size={200} color={colors.white} />,
  ];
  return (
    <Scene
      tint={colors.magenta}
      captions="04-envejece"
      visual={
        <div style={{ position: "relative", width: 1000, height: 640 }}>
          {/* Reloj que acelera: envejecer */}
          <div
            style={{
              position: "absolute",
              left: 430,
              top: 20,
              opacity: interpolate(frame, [age - 2, age + 4, hurt, hurt + 8], [0, 1, 1, 0], clamp),
              scale: String(interpolate(frame, [age - 2, age + 6], [0.6, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })),
            }}
          >
            <Clock size={140} speed={40} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 190, height: 220, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 34, opacity: dim }}>
            {icons.map((icon, i) => {
              const pop = spring({ frame: frame - ANIMAL_POP[i], fps, config: { damping: 12, stiffness: 180 } });
              const isHurt = i === 3;
              return (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    opacity: Math.min(1, pop * 1.5),
                    scale: String(pop),
                    rotate: `${aged * (i % 2 ? 5 : -5)}deg`,
                    translate: `0px ${aged * 12}px`,
                    filter: `grayscale(${aged}) brightness(${1 - aged * 0.45}) drop-shadow(0 0 ${isHurt ? redFlash * 30 : 0}px ${colors.red})`,
                  }}
                >
                  {icon}
                  {isHurt ? (
                    // Grieta: lastimarse
                    <svg width={110} height={220} viewBox="0 0 110 220" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                      <polyline
                        points="62,10 48,52 66,80 44,122 64,150 50,205"
                        fill="none"
                        stroke={colors.red}
                        strokeWidth={6}
                        strokeLinejoin="round"
                        strokeDasharray={260}
                        strokeDashoffset={260 * crack}
                        opacity={frame >= hurt ? 1 : 0}
                      />
                    </svg>
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* El latido se apaga: el principio del fin */}
          <div style={{ position: "absolute", left: 40, top: 440 }}>
            <Ecg width={920} amplitude={interpolate(frame, [end, dur - 4], [1, 0], clamp)} color={colors.magenta} opacity={0.85} />
          </div>
        </div>
      }
    >
      <div
        style={{
          fontFamily: fonts.accent,
          fontSize: 190,
          color: "#9AA0AE",
          opacity: interpolate(frame, [cue("04-envejece", "fin", fps), cue("04-envejece", "fin", fps) + 6], [0, 1], clamp),
          letterSpacing: 8,
        }}
      >
        FIN
      </div>
    </Scene>
  );
};

// 5 · No muere — "Pero ella hace algo distinto. En lugar de morir… se hunde, y se encoge."
// El latido vuelve, el sello "FIN" se tacha y la cámara la sigue hacia el fondo.
export const Sinks: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revive = cue("05-no-muere", "distinto", fps);
  const stamp = cue("05-no-muere", "lugar", fps);
  const strike = cue("05-no-muere", "morir", fps, "end");
  const sink = cue("05-no-muere", "hunde", fps);
  const alive = spring({ frame: frame - revive, fps, config: { damping: 10, stiffness: 120 } });
  const stamped = spring({ frame: frame - stamp, fps, config: { damping: 9, stiffness: 220 } });
  const p = interpolate(frame, [sink, dur], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <Scene
      tint={colors.cyan}
      captions="05-no-muere"
      backdrop={<AbsoluteFill style={{ background: "linear-gradient(180deg, #000000 0%, #000000 100%)", opacity: p * 0.7 }} />}
      visual={
        <div style={{ position: "relative", width: 1000, height: 640, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Medusa
            size={400}
            pulseSpeed={0.4 + alive * 0.6}
            retract={p}
            desaturate={1 - alive}
            glow={alive > 0.5 ? colors.cyan : "#557"}
            style={{ translate: `0px ${p * 150 - 40}px`, scale: String(1 - p * 0.35) }}
          />
          {/* Burbujas que suben mientras se hunde */}
          {Array.from({ length: 9 }, (_, i) => {
            const s = sink + i * 3;
            const y = interpolate(frame, [s, s + 34], [560, -40], clamp);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 360 + random(`b${i}`) * 280,
                  top: y,
                  width: 14 + (i % 3) * 8,
                  height: 14 + (i % 3) * 8,
                  borderRadius: "50%",
                  border: `3px solid ${colors.cyan}`,
                  opacity: frame >= s && frame < s + 34 ? 0.6 : 0,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 40, top: 470, opacity: interpolate(frame, [stamp, stamp + 10], [1, 0], clamp) }}>
            <Ecg width={920} amplitude={alive} color={colors.cyan} opacity={0.85} />
          </div>
        </div>
      }
    >
      {/* Sello "FIN" que se tacha: en lugar de morir… */}
      <div
        style={{
          position: "relative",
          border: `10px solid ${colors.red}`,
          borderRadius: 18,
          padding: "0px 50px",
          rotate: "-8deg",
          opacity: Math.min(1, stamped * 2) * interpolate(frame, [sink, sink + 10], [1, 0], clamp),
          scale: String(1.6 - 0.6 * stamped),
        }}
      >
        <div style={{ fontFamily: fonts.accent, fontSize: 170, color: colors.red, lineHeight: 1.1, letterSpacing: 8 }}>FIN</div>
        <div
          style={{
            position: "absolute",
            left: -30,
            right: -30,
            top: "48%",
            height: 18,
            borderRadius: 9,
            backgroundColor: colors.cyan,
            boxShadow: `0 0 20px ${colors.cyan}`,
            scale: `${interpolate(frame, [strike, strike + 6], [0, 1], clamp)} 1`,
            rotate: "-4deg",
          }}
        />
      </div>
    </Scene>
  );
};

// 6 · Quiste — "Su cuerpo se reduce a una pequeña bolita de células."
// La medusa encogida se funde en la bolita y la cámara se acerca a ver sus células.
const Cyst: React.FC<{ readonly start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 140 } });
  const wobble = (k: number) => 1 + Math.sin(frame * 0.18 + k) * 0.04;
  return (
    <div style={{ position: "relative", width: 460, height: 460 }}>
      <div style={{ position: "absolute", left: 230 - 136, top: 60, opacity: interpolate(frame, [0, start + 6], [1, 0], clamp), scale: String(interpolate(frame, [0, start + 6], [1, 0.5], clamp)) }}>
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
              r={(13 + (i % 3) * 3) * (1 + 0.12 * Math.sin(frame * 0.3 + i))}
              fill="#FFD3C7"
              opacity={0.6}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const CystScene: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = cue("06-quiste", "bolita", fps);
  return (
    <Scene
      tint={colors.red}
      captions="06-quiste"
      camera={{ scale: String(interpolate(frame, [zoom, dur], [1, 1.55], { ...clamp, easing: Easing.inOut(Easing.cubic) })) }}
      visual={<Cyst start={cue("06-quiste", "reduce", fps)} />}
    />
  );
};

// 7 · Clímax — "Y entonces ocurre la clave: sus células cambian de tipo. Transdiferenciación."
// Vista macro dentro de la bolita: cada célula cambia de forma (músculo, neurona, piel) con un bloop.
const CELLS = [
  [0, 0],
  ...Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3) * 140, Math.sin((i * Math.PI) / 3) * 140]),
  ...Array.from({ length: 6 }, (_, i) => [Math.cos((i * Math.PI) / 3 + Math.PI / 6) * 250, Math.sin((i * Math.PI) / 3 + Math.PI / 6) * 250]),
];
// Orden en que cambian: del centro hacia afuera, alternando
const ORDER = [0, 1, 4, 2, 5, 3, 6, 7, 10, 8, 11, 9, 12];

export const cellTiming = (fps: number) => {
  const start = cue("07-clave", "sus", fps);
  const climax = cue("07-clave", "transdiferenciacion", fps);
  const stagger = Math.max(2, Math.floor((climax - 4 - start) / CELLS.length));
  return { start, climax, stagger, count: CELLS.length };
};

const CellShape: React.FC<{ readonly kind: number }> = ({ kind }) => {
  if (kind === 0) {
    // Músculo: alargada con estrías
    return (
      <g>
        <rect x={-62} y={-20} width={124} height={40} rx={20} fill={colors.magenta} />
        {[-30, -10, 10, 30].map((x) => (
          <line key={x} x1={x} y1={-14} x2={x} y2={14} stroke="#FFD1F4" strokeWidth={4} />
        ))}
      </g>
    );
  }
  if (kind === 1) {
    // Neurona: cuerpo con dendritas
    return (
      <g stroke={colors.magenta} strokeWidth={7} strokeLinecap="round">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1={0} y1={0} x2={0} y2={-58} />
            <line x1={0} y1={-40} x2={14} y2={-56} />
          </g>
        ))}
        <circle r={24} fill={colors.magenta} />
      </g>
    );
  }
  // Piel: célula plana hexagonal
  return <polygon points="44,0 22,38 -22,38 -44,0 -22,-38 22,-38" fill={colors.magenta} />;
};

const Cells: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { start, stagger } = cellTiming(fps);
  return (
    <svg width={700} height={700} viewBox="-350 -350 700 700" style={{ overflow: "visible", rotate: `${frame * 0.35}deg` }}>
      <defs>
        <radialGradient id="inside" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3A0F18" />
          <stop offset="85%" stopColor="#5E1824" />
          <stop offset="100%" stopColor={colors.red} />
        </radialGradient>
      </defs>
      <circle r={335} fill="url(#inside)" opacity={0.85} style={{ filter: `drop-shadow(0 0 30px ${colors.red})` }} />
      {CELLS.map(([x, y], i) => {
        const s = start + ORDER.indexOf(i) * stagger;
        const p = interpolate(frame, [s, s + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
        const wob = 1 + Math.sin(frame * 0.25 + i) * 0.05;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${random(`rot${i}`) * 180})`}>
            <circle r={44 * wob * (1 - p * 0.6)} fill={colors.red} opacity={1 - p} />
            <g transform={`scale(${Math.max(0.01, p)})`} opacity={Math.min(1, p * 1.5)} style={{ filter: `drop-shadow(0 0 14px ${colors.magenta})` }}>
              <CellShape kind={i % 3} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

export const Transdifferentiation: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { climax } = cellTiming(fps);
  return (
    <>
      <Scene
        tint={colors.magenta}
        captions="07-clave"
        camera={{ scale: String(interpolate(frame, [0, dur], [1.15, 0.85], { ...clamp, easing: Easing.inOut(Easing.quad) })) }}
        visual={<Cells />}
      >
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
// Efecto rebobinado: la medusa recorre el ciclo hacia atrás hasta volverse pólipo sobre una roca.
const bezier = (t: number, p0: number, p1: number, p2: number, p3: number) =>
  (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3;

export const BackToPolyp: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const back = cue("08-polipo", "vuelve", fps);
  const polyp = cue("08-polipo", "polipo", fps);
  const p = interpolate(frame, [back, polyp + 4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const grow = spring({ frame: frame - polyp, fps, config: { damping: 14 } });
  const vhs = interpolate(frame, [back - 2, back + 2, polyp, polyp + 6], [0, 1, 1, 0], clamp);
  const mx = bezier(p, 700, 620, 300, 230);
  const my = bezier(p, 300, 60, 60, 250);
  return (
    <Scene
      tint={colors.cyan}
      captions="08-polipo"
      foreground={
        <AbsoluteFill style={{ opacity: vhs }}>
          <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px)" }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (frame * 37 + i * 640) % 1920, height: 30 + i * 18, backgroundColor: "rgba(255,255,255,0.09)" }} />
          ))}
          <div style={{ position: "absolute", left: 90, top: 300, opacity: frame % 10 < 6 ? 1 : 0.4 }}>
            <RewindIcon size={110} />
          </div>
        </AbsoluteFill>
      }
      visual={
        <div style={{ position: "relative", width: 900, height: 640 }}>
          <svg width={900} height={640} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <path
              d="M 700 300 C 620 60, 300 60, 230 250"
              fill="none"
              stroke={colors.cyan}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray="4 22"
              opacity={0.6}
              strokeDashoffset={frame * 3}
            />
            {/* Fondo marino y roca donde se fija el pólipo */}
            <defs>
              <linearGradient id="seabed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22343A" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22343A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d="M -60 600 Q 200 575 450 592 T 960 590 L 960 660 L -60 660 Z" fill="url(#seabed)" />
            <path d="M 110 600 C 120 540, 180 520, 240 530 C 300 520, 350 560, 360 600 Z" fill="#2C3A40" />
          </svg>
          <div style={{ position: "absolute", left: 155, top: 222 }}>
            <Polyp height={380} grow={grow} />
          </div>
          <div
            style={{
              position: "absolute",
              left: mx - 100,
              top: my - 60,
              opacity: 1 - p * 0.95,
              scale: String(1 - p * 0.75),
            }}
          >
            <Medusa size={200} />
          </div>
        </div>
      }
    >
      <Words words={[{ text: "PÓLIPO", accent: true, color: colors.cyan, size: 220 }]} delay={polyp} />
    </Scene>
  );
};

// 9 · Brotes — "Y de ese pólipo brotan medusas nuevas, genéticamente idénticas."
// La cámara sube con las medusas que brotan; después se alinean como copias idénticas.
const Bud: React.FC<{ readonly start: number; readonly x: number }> = ({ start, x }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 36], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
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
      <Medusa size={110} />
    </div>
  );
};

export const BUD_OFFSETS = [0, 7, 14];

export const Budding: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bud = cue("09-brotes", "brotan", fps);
  const same = cue("09-brotes", "geneticamente", fps);
  const eq = interpolate(frame, [same, same + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <Scene
      tint={colors.cyan}
      captions="09-brotes"
      camera={{ translate: `0px ${interpolate(frame, [0, dur], [-50, 110], { ...clamp, easing: Easing.inOut(Easing.quad) })}px` }}
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
          {/* Signos "=" entre las copias: genéticamente idénticas */}
          {[377, 522].map((x) => (
            <div
              key={x}
              style={{
                position: "absolute",
                left: x - 25,
                top: 0,
                fontFamily: fonts.accent,
                fontSize: 80,
                color: colors.yellow,
                textShadow: `0 0 20px ${colors.yellow}`,
                opacity: eq,
                scale: String(eq),
              }}
            >
              =
            </div>
          ))}
        </div>
      }
    >
      <div style={{ opacity: interpolate(frame, [same - 2, same + 8], [0, 1], clamp), scale: String(interpolate(frame, [same - 2, same + 10], [0.6, 1], clamp)) }}>
        <Helix width={620} />
      </div>
    </Scene>
  );
};

// 10 · Cierre — "Una y otra vez… mientras nada se la coma."
// Pasa la sombra de un depredador; al terminar la frase, el ciclo y el texto se desvanecen y una
// medusa nueva sube hasta quedar exactamente como en el frame 0 (mismo lugar, tamaño, latido y fondo).
export const Loop: React.FC<Props> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = dur - OUTRO; // fin de la frase
  const last = dur - 1;
  const predator = cue("10-cierre", "nada", fps);
  const settle = interpolate(frame, [end - 6, last - 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fade = interpolate(frame, [end, end + 20], [1, 0], clamp);
  return (
    <Scene
      tint={colors.cyan}
      captions="10-cierre"
      bgOffset={-last}
      textOpacity={fade}
      // Misma cámara que el hook en su frame 0, para que el último frame sea idéntico
      camera={{ scale: "1" }}
      foreground={
        frame < predator - 8 || frame > predator + 26 ? null : (
        <div
          style={{
            position: "absolute",
            top: 470,
            left: interpolate(frame, [predator - 8, predator + 26], [-760, 1150], clamp),
            opacity: 0.6,
          }}
        >
          <FishShadow width={720} />
        </div>
        )
      }
      visual={
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 40,
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
    />
  );
};
