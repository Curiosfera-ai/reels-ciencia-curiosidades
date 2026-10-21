import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Aging, BackToPolyp, Budding, CystScene, Hook, Loop, Name, Sinks, Size, Transdifferentiation } from "./Scenes";

// Los whoosh tienen el pico a los 0.23 s: arrancan 7 frames antes del corte.
// El whoosh invertido termina en seco a los 0.5 s: arranca 15 frames antes.
export const MedusaInmortal: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05060B" }}>
      <Sequence name="1 · Hook" durationInFrames={3 * fps}>
        <Hook />
      </Sequence>
      <Sequence name="2 · Nombre" from={3 * fps} durationInFrames={2.5 * fps}>
        <Name />
      </Sequence>
      <Sequence name="3 · Tamaño" from={5.5 * fps} durationInFrames={2.5 * fps}>
        <Size />
      </Sequence>
      <Sequence name="4 · Envejece" from={8 * fps} durationInFrames={2.5 * fps}>
        <Aging />
      </Sequence>
      <Sequence name="5 · No muere" from={10.5 * fps} durationInFrames={2.5 * fps}>
        <Sinks />
      </Sequence>
      <Sequence name="6 · Quiste" from={13 * fps} durationInFrames={2.5 * fps}>
        <CystScene />
      </Sequence>
      <Sequence name="7 · Transdiferenciación" from={15.5 * fps} durationInFrames={3 * fps}>
        <Transdifferentiation />
      </Sequence>
      <Sequence name="8 · Pólipo" from={18.5 * fps} durationInFrames={2.5 * fps}>
        <BackToPolyp />
      </Sequence>
      <Sequence name="9 · Brotes" from={21 * fps} durationInFrames={2 * fps}>
        <Budding />
      </Sequence>
      <Sequence name="10 · Cierre" from={23 * fps} durationInFrames={2 * fps}>
        <Loop />
      </Sequence>

      <Audio name="Música" src={staticFile("audio/music.wav")} volume={0.35} />

      <Audio name="Golpe INMORTAL" src={staticFile("audio/boom.wav")} from={10} volume={0.9} />
      <Audio name="Pop pregunta" src={staticFile("audio/pop.wav")} from={60} volume={0.7} />
      <Audio name="Whoosh nombre" src={staticFile("audio/whoosh.wav")} from={83} volume={0.6} />
      <Audio name="Pop tamaño" src={staticFile("audio/pop.wav")} from={165} volume={0.7} />
      <Audio name="Ticks contador" src={staticFile("audio/ticks.wav")} from={168} volume={0.45} />
      <Audio name="Whoosh envejece" src={staticFile("audio/whoosh.wav")} from={233} volume={0.6} />
      <Audio name="Click no muere" src={staticFile("audio/click.wav")} from={315} volume={0.7} />
      <Audio name="Pop quiste" src={staticFile("audio/pop.wav")} from={390} volume={0.7} />
      <Audio name="Click células" src={staticFile("audio/click.wav")} from={465} volume={0.7} />
      <Audio name="Sting clímax" src={staticFile("audio/sting.wav")} from={485} volume={0.85} />
      <Audio name="Whoosh invertido pólipo" src={staticFile("audio/whoosh-reverse.wav")} from={540} volume={0.6} />
      <Audio name="Pop brote 1" src={staticFile("audio/pop.wav")} from={638} volume={0.6} />
      <Audio name="Pop brote 2" src={staticFile("audio/pop.wav")} from={648} volume={0.6} />
      <Audio name="Pop brote 3" src={staticFile("audio/pop.wav")} from={658} volume={0.6} />
      <Audio name="Whoosh cierre" src={staticFile("audio/whoosh.wav")} from={683} volume={0.6} />
      <Audio name="Golpe final" src={staticFile("audio/boom.wav")} from={720} volume={0.9} />
    </AbsoluteFill>
  );
};
