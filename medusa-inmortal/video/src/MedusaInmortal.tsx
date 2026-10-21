import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Aging, BackToPolyp, BUD_OFFSETS, Budding, CystScene, Hook, Loop, Name, Sinks, Size, Transdifferentiation } from "./Scenes";
import { cue, timeline } from "./voice";

// Los whoosh tienen el pico a los 0.23 s: arrancan 7 frames antes del corte.
// El whoosh invertido termina en seco a los 0.5 s: arranca 15 frames antes.
export const MedusaInmortal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = timeline(fps);
  const end = t["10-cierre"].from + t["10-cierre"].speechEnd; // fin de la última frase

  return (
    <AbsoluteFill style={{ backgroundColor: "#05060B" }}>
      <Sequence name="1 · Hook" from={t["01-hook"].from} durationInFrames={t["01-hook"].dur}>
        <Hook dur={t["01-hook"].dur} />
        <Audio name="Voz 1" src={staticFile("voiceover/01-hook.mp3")} from={t["01-hook"].lead} />
      </Sequence>
      <Sequence name="2 · Nombre" from={t["02-nombre"].from} durationInFrames={t["02-nombre"].dur}>
        <Name dur={t["02-nombre"].dur} />
        <Audio name="Voz 2" src={staticFile("voiceover/02-nombre.mp3")} from={t["02-nombre"].lead} />
      </Sequence>
      <Sequence name="3 · Tamaño" from={t["03-tamano"].from} durationInFrames={t["03-tamano"].dur}>
        <Size dur={t["03-tamano"].dur} />
        <Audio name="Voz 3" src={staticFile("voiceover/03-tamano.mp3")} from={t["03-tamano"].lead} />
      </Sequence>
      <Sequence name="4 · Envejece" from={t["04-envejece"].from} durationInFrames={t["04-envejece"].dur}>
        <Aging dur={t["04-envejece"].dur} />
        <Audio name="Voz 4" src={staticFile("voiceover/04-envejece.mp3")} from={t["04-envejece"].lead} />
      </Sequence>
      <Sequence name="5 · No muere" from={t["05-no-muere"].from} durationInFrames={t["05-no-muere"].dur}>
        <Sinks dur={t["05-no-muere"].dur} />
        <Audio name="Voz 5" src={staticFile("voiceover/05-no-muere.mp3")} from={t["05-no-muere"].lead} />
      </Sequence>
      <Sequence name="6 · Quiste" from={t["06-quiste"].from} durationInFrames={t["06-quiste"].dur}>
        <CystScene dur={t["06-quiste"].dur} />
        <Audio name="Voz 6" src={staticFile("voiceover/06-quiste.mp3")} from={t["06-quiste"].lead} />
      </Sequence>
      <Sequence name="7 · Transdiferenciación" from={t["07-clave"].from} durationInFrames={t["07-clave"].dur}>
        <Transdifferentiation dur={t["07-clave"].dur} />
        <Audio name="Voz 7" src={staticFile("voiceover/07-clave.mp3")} from={t["07-clave"].lead} />
      </Sequence>
      <Sequence name="8 · Pólipo" from={t["08-polipo"].from} durationInFrames={t["08-polipo"].dur}>
        <BackToPolyp dur={t["08-polipo"].dur} />
        <Audio name="Voz 8" src={staticFile("voiceover/08-polipo.mp3")} from={t["08-polipo"].lead} />
      </Sequence>
      <Sequence name="9 · Brotes" from={t["09-brotes"].from} durationInFrames={t["09-brotes"].dur}>
        <Budding dur={t["09-brotes"].dur} />
        <Audio name="Voz 9" src={staticFile("voiceover/09-brotes.mp3")} from={t["09-brotes"].lead} />
      </Sequence>
      <Sequence name="10 · Cierre" from={t["10-cierre"].from} durationInFrames={t["10-cierre"].dur}>
        <Loop dur={t["10-cierre"].dur} />
        <Audio name="Voz 10" src={staticFile("voiceover/10-cierre.mp3")} from={t["10-cierre"].lead} />
      </Sequence>

      {/* Música baja para no tapar la voz; se apaga gradualmente al terminar la última frase */}
      <Audio
        name="Música"
        src={staticFile("audio/music.wav")}
        volume={interpolate(frame, [0, 10, end, durationInFrames - 1], [0, 0.16, 0.16, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      <Audio name="Golpe INMORTAL" src={staticFile("audio/boom.wav")} from={t["01-hook"].from + cue("01-hook", "inmortal", fps)} volume={0.7} />
      <Audio name="Pop pregunta" src={staticFile("audio/pop.wav")} from={t["01-hook"].dur - 16} volume={0.5} />
      <Audio name="Whoosh nombre" src={staticFile("audio/whoosh.wav")} from={t["02-nombre"].from - 7} volume={0.45} />
      <Audio name="Pop tamaño" src={staticFile("audio/pop.wav")} from={t["03-tamano"].from} volume={0.5} />
      <Audio name="Ticks contador" src={staticFile("audio/ticks.wav")} from={t["03-tamano"].from + cue("03-tamano", "cuatro", fps)} volume={0.3} />
      <Audio name="Whoosh envejece" src={staticFile("audio/whoosh.wav")} from={t["04-envejece"].from - 7} volume={0.45} />
      <Audio name="Click no muere" src={staticFile("audio/click.wav")} from={t["05-no-muere"].from} volume={0.5} />
      <Audio name="Pop quiste" src={staticFile("audio/pop.wav")} from={t["06-quiste"].from + cue("06-quiste", "reduce", fps)} volume={0.5} />
      <Audio name="Click células" src={staticFile("audio/click.wav")} from={t["07-clave"].from} volume={0.5} />
      <Audio name="Sting clímax" src={staticFile("audio/sting.wav")} from={t["07-clave"].from + cue("07-clave", "transdiferenciacion", fps)} volume={0.6} />
      <Audio name="Whoosh invertido pólipo" src={staticFile("audio/whoosh-reverse.wav")} from={t["08-polipo"].from - 15} volume={0.45} />
      <Audio name="Pop brote 1" src={staticFile("audio/pop.wav")} from={t["09-brotes"].from + cue("09-brotes", "brotan", fps) + BUD_OFFSETS[0]} volume={0.4} />
      <Audio name="Pop brote 2" src={staticFile("audio/pop.wav")} from={t["09-brotes"].from + cue("09-brotes", "brotan", fps) + BUD_OFFSETS[1]} volume={0.4} />
      <Audio name="Pop brote 3" src={staticFile("audio/pop.wav")} from={t["09-brotes"].from + cue("09-brotes", "brotan", fps) + BUD_OFFSETS[2]} volume={0.4} />
      <Audio name="Whoosh cierre" src={staticFile("audio/whoosh.wav")} from={t["10-cierre"].from - 7} volume={0.45} />
      <Audio
        name="Swell final"
        src={staticFile("audio/swell.wav")}
        from={end - 10}
        volume={interpolate(frame, [end - 10, durationInFrames - 1], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
