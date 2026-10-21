import React, { useId } from "react";
import { useEstilo, useTime, sway } from "../anim";
import { blinkOf, gestureOf, mouthOf, mouthShapeOf, MouthShape } from "../timeline";
import { colors as c } from "../theme";

type Placement = {
  x: number; // centro, en px del cuadro
  y: number; // donde apoya los pies
  h: number; // alto en px
  flip?: boolean;
  opacity?: number;
};

const Place: React.FC<Placement & { ratio: number; children: React.ReactNode; rotate?: number; shadow?: boolean }> = ({
  x,
  y,
  h,
  flip,
  opacity = 1,
  ratio,
  rotate = 0,
  shadow = true,
  children,
}) => {
  const estilo = useEstilo();
  return (
    <div
      style={{
        position: "absolute",
        left: x - (h * ratio) / 2,
        top: y - h,
        width: h * ratio,
        height: h,
        opacity,
        scale: flip ? "-1 1" : undefined,
        rotate: `${rotate}deg`,
        transformOrigin: "50% 100%",
      }}
    >
      {estilo === "25d" && shadow ? (
        // sombra de contacto: apoya al personaje en el pasto
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "8%",
            bottom: "-4%",
            height: "9%",
            background: "radial-gradient(closest-side, rgba(52,92,44,0.38), rgba(52,92,44,0))",
          }}
        />
      ) : null}
      {children}
    </div>
  );
};

// Degradés de volumen para el modo 2.5D: luz arriba a la izquierda, sombra abajo a la derecha
const Volumen: React.FC<{ id: string; tonos: Record<string, [string, string, string]> }> = ({ id, tonos }) => (
  <defs>
    {Object.entries(tonos).map(([name, [luz, base, sombra]]) => (
      <radialGradient key={name} id={`${name}-${id}`} cx="0.36" cy="0.3" r="0.85">
        <stop offset="0" stopColor={luz} />
        <stop offset="0.5" stopColor={base} />
        <stop offset="1" stopColor={sombra} />
      </radialGradient>
    ))}
  </defs>
);

// Devuelve el relleno: color plano o degradé, según el estilo
const useFill = (id: string) => {
  const estilo = useEstilo();
  return (name: string, plano: string) => (estilo === "25d" ? `url(#${name}-${id})` : plano);
};

const Eye: React.FC<{ x: number; y: number; rx: number; ry: number; blink: number; look: number }> = ({
  x,
  y,
  rx,
  ry,
  blink,
  look,
}) => {
  const open = Math.max(0.1, 1 - blink);
  const cy = y - look * 5;
  return (
    <g>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry * open} fill={c.ojos} />
      {open > 0.5 ? (
        <>
          <circle cx={x + rx * 0.35} cy={cy - ry * 0.38} r={rx * 0.36} fill="#fff" />
          <circle cx={x - rx * 0.3} cy={cy + ry * 0.35} r={rx * 0.15} fill="#fff" />
        </>
      ) : null}
    </g>
  );
};

// Boca con forma de cada sonido: `open` la abre, `wide` la estira (E, I) o la redondea (O, U)
const Mouth: React.FC<{ x: number; y: number; w: number; shape: MouthShape; stroke: number }> = ({ x, y, w, shape, stroke }) => {
  if (shape.open < 0.08) {
    return (
      <path
        d={`M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}`}
        stroke={c.ojos}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  const hw = w * shape.wide;
  const depth = w * (0.35 + 1.25 * shape.open);
  const round = shape.wide < 0.7;
  const d = round
    ? // O / U: boca redonda
      `M${x - hw} ${y + depth * 0.45} Q${x - hw} ${y - depth * 0.05} ${x} ${y - depth * 0.05} Q${x + hw} ${y - depth * 0.05} ${x + hw} ${y + depth * 0.45} Q${x + hw} ${y + depth} ${x} ${y + depth} Q${x - hw} ${y + depth} ${x - hw} ${y + depth * 0.45} Z`
    : `M${x - hw} ${y} Q${x} ${y + w * 0.3} ${x + hw} ${y} Q${x + hw * 0.65} ${y + depth} ${x} ${y + depth} Q${x - hw * 0.65} ${y + depth} ${x - hw} ${y} Z`;
  return (
    <g>
      <path d={d} fill={c.boca} stroke={c.ojos} strokeWidth={stroke * 0.6} strokeLinejoin="round" />
      {shape.open > 0.4 ? <ellipse cx={x} cy={y + depth * 0.78} rx={hw * 0.42} ry={depth * 0.18} fill="#F28C9A" /> : null}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Pino: zorrito naranja, ojos grandes, siempre sonriente
// ---------------------------------------------------------------------------

export const Pino: React.FC<
  Placement & { wave?: number; walking?: boolean; lookUp?: number; tilt?: number; bounce?: number; talk?: boolean }
> = ({ wave = 0, walking = false, lookUp = 0, tilt = 0, bounce = 0, talk = true, ...place }) => {
  const { t } = useTime();
  const id = useId().replace(/:/g, "");
  const fill = useFill(id);
  const shape = talk ? mouthShapeOf("pino", t) : { open: 0, wide: 1 };
  const g = gestureOf("pino", t);
  const blink = blinkOf("pino", t);
  const step = walking ? Math.sin(2 * Math.PI * 1.6 * t) : 0;
  const bob = walking ? Math.abs(step) * 6 : sway(t, 3.2) * 1.5;
  const tail = 8 * sway(t, 2.6) + (walking ? 6 * step : 0);
  const free = 1 - wave;
  const armR =
    -wave * (128 + 16 * Math.sin(2 * Math.PI * 1.8 * t)) -
    free * (g.point * (1 - g.cheer) * 92 + g.cheer * (150 + 8 * Math.sin(2 * Math.PI * 2 * t)));
  const armL = g.cheer * (150 + 8 * Math.sin(2 * Math.PI * 2 * t + 1));
  // asiente apenas cuando nombra algo o festeja
  const nod = 3 * Math.max(g.point, g.cheer) * Math.sin(2 * Math.PI * 1.5 * t);
  return (
    <Place {...place} y={place.y - bounce * 40} ratio={300 / 380}>
      <svg viewBox="0 0 300 380" width="100%" height="100%" style={{ overflow: "visible" }}>
        <Volumen
          id={id}
          tonos={{
            naranja: ["#FFC48F", c.naranja, "#D97A38"],
            oscuro: ["#F7A766", c.naranjaOscuro, "#C96E2E"],
            crema: ["#FFFFFF", c.crema, "#F0D9BE"],
          }}
        />
        <defs>
          <clipPath id={`cola-${id}`}>
            <ellipse cx={240} cy={262} rx={40} ry={80} transform="rotate(35 240 262)" />
          </clipPath>
        </defs>
        {/* cola */}
        <g transform={`rotate(${tail} 200 300)`}>
          <ellipse cx={240} cy={262} rx={40} ry={80} transform="rotate(35 240 262)" fill={fill("naranja", c.naranja)} />
          <g clipPath={`url(#cola-${id})`}>
            <ellipse cx={288} cy={196} rx={34} ry={36} fill={fill("crema", c.crema)} />
          </g>
        </g>
        {/* patas */}
        <ellipse cx={122} cy={364 - Math.max(0, step) * 10} rx={24} ry={14} fill={fill("oscuro", c.naranjaOscuro)} />
        <ellipse cx={178} cy={364 - Math.max(0, -step) * 10} rx={24} ry={14} fill={fill("oscuro", c.naranjaOscuro)} />
        <g transform={`translate(0 ${-bob})`}>
          {/* cuerpo */}
          <ellipse cx={150} cy={298} rx={72} ry={66} fill={fill("naranja", c.naranja)} />
          <ellipse cx={150} cy={312} rx={44} ry={46} fill={fill("crema", c.crema)} />
          {/* brazos */}
          <g transform={`rotate(${armL} 96 272)`}>
            <ellipse cx={88} cy={298} rx={15} ry={30} transform="rotate(18 88 298)" fill={fill("oscuro", c.naranjaOscuro)} />
          </g>
          <g transform={`rotate(${armR} 204 272)`}>
            <ellipse cx={212} cy={298} rx={15} ry={30} transform="rotate(-18 212 298)" fill={fill("oscuro", c.naranjaOscuro)} />
          </g>
          {/* cabeza */}
          <g transform={`rotate(${tilt + nod} 150 220)`}>
            {[false, true].map((mirror) => (
              <g key={String(mirror)} transform={mirror ? "translate(300 0) scale(-1 1)" : undefined}>
                <path d="M70 122 C56 66 66 30 90 32 C110 36 128 60 134 80 Z" fill={fill("naranja", c.naranja)} />
                <path d="M84 104 C76 70 82 50 94 52 C104 56 114 68 120 82 Z" fill="#FFD7BE" />
              </g>
            ))}
            <ellipse cx={150} cy={160} rx={100} ry={90} fill={fill("naranja", c.naranja)} />
            <ellipse cx={104} cy={196} rx={48} ry={40} fill={fill("crema", c.crema)} />
            <ellipse cx={196} cy={196} rx={48} ry={40} fill={fill("crema", c.crema)} />
            <ellipse cx={150} cy={210} rx={44} ry={36} fill={fill("crema", c.crema)} />
            <Eye x={112} y={158} rx={19} ry={23} blink={blink} look={lookUp} />
            <Eye x={188} y={158} rx={19} ry={23} blink={blink} look={lookUp} />
            <ellipse cx={86} cy={200} rx={16} ry={10} fill={c.rubor} opacity={0.75} />
            <ellipse cx={214} cy={200} rx={16} ry={10} fill={c.rubor} opacity={0.75} />
            <ellipse cx={150} cy={189} rx={12} ry={8.5} fill={c.ojos} />
            <ellipse cx={146} cy={186} rx={4} ry={2.5} fill="#fff" opacity={0.6} />
            <Mouth x={150} y={204} w={17} shape={shape} stroke={5} />
          </g>
        </g>
      </svg>
    </Place>
  );
};

// ---------------------------------------------------------------------------
// Nube: tortuga sabia y lenta, con anteojitos redondos. Mira a la izquierda.
// ---------------------------------------------------------------------------

// Punto más alto del caparazón de Nube (para que Beto se pare ahí)
export const caparazonArriba = (x: number, y: number, h: number) => {
  const k = h / 300;
  return { x: x - (440 * k) / 2 + 285 * k, y: y - h + 96 * k };
};

export const Nube: React.FC<Placement & { lookUp?: number; bounce?: number }> = ({ lookUp = 0, bounce = 0, ...place }) => {
  const { t } = useTime();
  const id = useId().replace(/:/g, "");
  const fill = useFill(id);
  const shape = mouthShapeOf("nube", t);
  const lid = 0.35 + 0.65 * blinkOf("nube", t);
  const head = 4 * sway(t, 4.5);
  const eye = (x: number) => {
    const y = 170 - lookUp * 4;
    const open = 1 - lid;
    return (
      <g key={x}>
        <ellipse cx={x} cy={y + 11 * (1 - open) * 0.5} rx={9} ry={Math.max(1.5, 12 * open)} fill={c.ojos} />
        <path d={`M${x - 11} ${y - 12 * open + 5} Q${x} ${y - 12 * open} ${x + 11} ${y - 12 * open + 5}`} stroke={c.ojos} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <Place {...place} y={place.y - bounce * 25} ratio={440 / 300}>
      <svg viewBox="0 0 440 300" width="100%" height="100%" style={{ overflow: "visible" }}>
        <Volumen
          id={id}
          tonos={{
            caparazon: ["#A9DFB5", c.caparazon, "#5A9E6C"],
            claro: ["#CDEFD3", c.caparazonClaro, "#86C394"],
            piel: ["#DDF3D6", c.pielTortuga, "#93C98C"],
            patas: ["#C4E8BE", c.patasTortuga, "#86BD80"],
          }}
        />
        {/* patas y colita */}
        {[
          [178, 278],
          [228, 286],
          [330, 286],
          [382, 278],
        ].map(([x, y]) => (
          <ellipse key={x} cx={x} cy={y} rx={26} ry={17} fill={fill("patas", c.patasTortuga)} />
        ))}
        <ellipse cx={428} cy={250} rx={18} ry={9} fill={fill("patas", c.patasTortuga)} />
        {/* caparazón */}
        <path d="M145 262 C145 150 205 92 285 92 C365 92 425 150 425 262 Z" fill={fill("caparazon", c.caparazon)} />
        {[
          [285, 140, 40, 26],
          [222, 192, 34, 30],
          [348, 192, 34, 30],
          [285, 222, 36, 24],
        ].map(([x, y, rx, ry]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} fill={fill("claro", c.caparazonClaro)} />
        ))}
        <rect x={135} y={246} width={300} height={28} rx={14} fill={c.bordeCaparazon} />
        {/* cuello y cabeza */}
        <ellipse cx={150} cy={222} rx={44} ry={28} fill={fill("piel", c.pielTortuga)} />
        <g transform={`translate(0 ${head})`}>
          <circle cx={98} cy={178} r={58} fill={fill("piel", c.pielTortuga)} />
          {eye(80)}
          {eye(118)}
          <circle cx={80} cy={170} r={18} fill="#fff" fillOpacity={0.18} stroke={c.anteojos} strokeWidth={3.5} />
          <circle cx={118} cy={170} r={18} fill="#fff" fillOpacity={0.18} stroke={c.anteojos} strokeWidth={3.5} />
          <path d="M98 168 Q99 164 100 168" stroke={c.anteojos} strokeWidth={3.5} fill="none" />
          <ellipse cx={62} cy={196} rx={11} ry={7} fill={c.rubor} opacity={0.7} />
          <ellipse cx={136} cy={196} rx={11} ry={7} fill={c.rubor} opacity={0.7} />
          <Mouth x={98} y={202} w={13} shape={shape} stroke={4} />
        </g>
      </svg>
    </Place>
  );
};

// ---------------------------------------------------------------------------
// Beto: pajarito rosa que canta
// ---------------------------------------------------------------------------

export const Beto: React.FC<Placement & { flying?: boolean; bounce?: number; rotate?: number }> = ({
  flying = false,
  bounce = 0,
  rotate = 0,
  ...place
}) => {
  const { t } = useTime();
  const id = useId().replace(/:/g, "");
  const fill = useFill(id);
  const m = mouthOf("beto", t);
  const blink = blinkOf("beto", t);
  const flap = flying ? 38 * Math.sin(2 * Math.PI * 3 * t) : 6 * sway(t, 2);
  const hover = flying ? 6 * Math.sin(2 * Math.PI * 1.5 * t) : 0;
  return (
    <Place {...place} y={place.y - bounce * 30 + hover} ratio={1} rotate={rotate} shadow={!flying}>
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
        <Volumen
          id={id}
          tonos={{
            cuerpo: ["#FFD6E4", c.rosa, "#E58FAF"],
            ala: ["#F7B6CD", c.rosaOscuro, "#D97C9F"],
          }}
        />
        {!flying ? (
          <g stroke={c.pico} strokeWidth={6} strokeLinecap="round">
            <path d="M88 176 L84 194 M84 194 L76 196 M84 194 L90 197" fill="none" />
            <path d="M112 176 L116 194 M116 194 L108 197 M116 194 L124 196" fill="none" />
          </g>
        ) : null}
        <ellipse cx={156} cy={140} rx={28} ry={12} transform="rotate(-30 156 140)" fill={fill("ala", c.rosaOscuro)} />
        <g transform={`rotate(${flap} 62 108)`}>
          <ellipse cx={48} cy={126} rx={18} ry={34} transform="rotate(20 48 126)" fill={fill("ala", c.rosaOscuro)} />
        </g>
        <g transform={`rotate(${-flap} 138 108)`}>
          <ellipse cx={152} cy={126} rx={18} ry={34} transform="rotate(-20 152 126)" fill={fill("ala", c.rosaOscuro)} />
        </g>
        <circle cx={100} cy={118} r={62} fill={fill("cuerpo", c.rosa)} />
        <ellipse cx={100} cy={142} rx={38} ry={33} fill={c.rosaClaro} />
        <ellipse cx={92} cy={58} rx={7} ry={15} transform="rotate(-25 92 58)" fill={c.rosaOscuro} />
        <ellipse cx={101} cy={53} rx={7} ry={16} fill={c.rosaOscuro} />
        <ellipse cx={110} cy={58} rx={7} ry={15} transform="rotate(25 110 58)" fill={c.rosaOscuro} />
        <Eye x={80} y={106} rx={10} ry={12} blink={blink} look={0} />
        <Eye x={120} y={106} rx={10} ry={12} blink={blink} look={0} />
        <ellipse cx={66} cy={128} rx={10} ry={6} fill={c.rubor} />
        <ellipse cx={134} cy={128} rx={10} ry={6} fill={c.rubor} />
        <path d={`M88 ${120 + m * 3} L112 ${120 + m * 3} L100 ${134 + m * 12} Z`} fill="#E8904A" strokeLinejoin="round" />
        <path d={`M86 120 Q100 ${112 - m * 4} 114 120 L100 ${130 - m * 2} Z`} fill={c.pico} strokeLinejoin="round" />
      </svg>
    </Place>
  );
};
