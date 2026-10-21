import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EstiloCtx, PlanoStart, useEstilo } from "./anim";
import { Letra, Subtitulos } from "./components/Textos";
import { PLANO_COMPONENTES } from "./Planos";
import { colors as c, ESTILO, SUBTITULOS } from "./theme";
import {
  DURACION,
  FUNDIDO,
  LINES,
  PLANOS,
  SONG_END,
  SONG_START,
  line,
  wordAt,
} from "./timeline";

// Efectos amables: solo campanitas y el trino de Beto (ver ../guion.md)
const SONIDOS: [number, string][] = [
  [1, "campanita-2"], // título
  [wordAt("03-tres", "rojo"), "campanita-1"],
  [wordAt("03-tres", "azul"), "campanita-2"],
  [wordAt("03-tres", "amarillo"), "campanita-3"],
  [wordAt("05-nube", "manzana"), "campanita-2"], // brilla la manzana
  [line("07-respuesta").end, "campanita-3"],
  [78.6, "trino"], // llega Beto
  [wordAt("10-pino", "azul"), "campanita-2"],
  [line("11-respuesta").end, "campanita-3"],
  [wordAt("14-pino", "amarillo"), "campanita-2"],
  [line("15-respuesta").end, "campanita-3"],
  [line("18-roja").start, "campanita-1"],
  [line("18-azul").start, "campanita-2"],
  [line("18-amarillo").start, "campanita-3"],
  [251, "campanita-final"],
];

const MUSICA = 0.22;

const Plano: React.FC<{ index: number; children: React.ReactNode }> = ({
  index,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const estilo = useEstilo();
  const opacity =
    index === 0
      ? 1
      : interpolate(frame, [0, FUNDIDO * fps], [0, 1], {
          extrapolateRight: "clamp",
        });
  // En 2.5D la cámara se acerca muy despacio durante todo el plano
  const [from, to] = PLANOS[index];
  const dolly =
    estilo === "25d"
      ? interpolate(frame, [0, (to - from) * fps], [1, 1.045], {
          extrapolateRight: "clamp",
        })
      : 1;
  return (
    <AbsoluteFill
      style={{ opacity, scale: String(dolly), transformOrigin: "50% 60%" }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Volumen para los objetos en 2.5D: brillo arriba a la izquierda calculado sobre la
// silueta de cada dibujo (así sirve para cualquier forma sin redibujarla)
const FiltrosVolumen: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter
        id="volumen"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation={10} result="relieve" />
        <feSpecularLighting
          in="relieve"
          surfaceScale={5}
          specularConstant={0.55}
          specularExponent={16}
          lightingColor="#fff"
          result="brillo"
        >
          <feDistantLight azimuth={225} elevation={48} />
        </feSpecularLighting>
        <feComposite
          in="brillo"
          in2="SourceAlpha"
          operator="in"
          result="brilloDentro"
        />
        <feComposite
          in="SourceGraphic"
          in2="brilloDentro"
          operator="arithmetic"
          k1={0}
          k2={1}
          k3={0.55}
          k4={0}
        />
      </filter>
    </defs>
  </svg>
);

export const Episodio01Colores: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <EstiloCtx.Provider value={ESTILO}>
      <AbsoluteFill style={{ backgroundColor: c.crema }}>
        <FiltrosVolumen />
        {PLANOS.map(([from, to], i) => {
          const Comp = PLANO_COMPONENTES[i];
          const extra = i === PLANOS.length - 1 ? 0 : FUNDIDO;
          return (
            <Sequence
              key={from}
              name={`Plano ${i + 1}`}
              from={Math.round(from * fps)}
              durationInFrames={Math.round((to - from + extra) * fps)}
            >
              <PlanoStart.Provider value={from}>
                <Plano index={i}>
                  <Comp />
                </Plano>
              </PlanoStart.Provider>
            </Sequence>
          );
        })}

        {SUBTITULOS ? <Subtitulos /> : null}
        <Letra />

        {/* Música de fondo: suave y constante; se aparta para la canción */}
        <Sequence name="Música" durationInFrames={Math.round(SONG_START * fps)}>
          <Audio
            src={staticFile("audio/musica-bosque.wav")}
            loop
            volume={(f) =>
              MUSICA *
              interpolate(
                f,
                [0, 1.5 * fps, (SONG_START - 4) * fps, SONG_START * fps],
                [0, 1, 1, 0],
                { extrapolateRight: "clamp" },
              )
            }
          />
        </Sequence>
        <Sequence
          name="Canción"
          from={Math.round(SONG_START * fps)}
          durationInFrames={Math.round((SONG_END - SONG_START + 1) * fps)}
        >
          <Audio src={staticFile("audio/cancion.wav")} volume={0.8} />
        </Sequence>
        <Sequence name="Música (despedida)" from={Math.round(SONG_END * fps)}>
          <Audio
            src={staticFile("audio/musica-bosque.wav")}
            loop
            volume={(f) => {
              const fin = (DURACION - SONG_END) * fps;
              return (
                MUSICA *
                interpolate(
                  f,
                  [0, 1.5 * fps, fin - 3 * fps, fin],
                  [0, 1, 1, 0],
                  { extrapolateRight: "clamp" },
                )
              );
            }}
          />
        </Sequence>

        {SONIDOS.map(([at, file], i) => (
          <Sequence
            key={i}
            name={file}
            from={Math.round(at * fps)}
            durationInFrames={Math.round(2.5 * fps)}
          >
            <Audio src={staticFile(`audio/${file}.wav`)} volume={0.35} />
          </Sequence>
        ))}

        {/* Voces (cuando estén grabadas con npm run voces) */}
        {LINES.filter((l) => l.hasVoice).map((l) => (
          <Sequence
            key={l.id}
            name={`Voz ${l.id}`}
            from={Math.round(l.start * fps)}
            durationInFrames={Math.ceil((l.end - l.start + 0.3) * fps)}
          >
            <Audio src={staticFile(`voces/${l.id}.mp3`)} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </EstiloCtx.Provider>
  );
};
