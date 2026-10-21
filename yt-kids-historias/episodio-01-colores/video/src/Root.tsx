import { Composition } from "remotion";
import { Episodio01Colores } from "./Episodio01Colores";

// YouTube Kids: horizontal 16:9. Duración del guion: 4:16 (ver ../guion.md)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episodio01Colores"
        component={Episodio01Colores}
        durationInFrames={256 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
