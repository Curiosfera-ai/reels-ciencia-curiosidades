import { Composition } from "remotion";
import { Episodio01Colores } from "./Episodio01Colores";
import { DURACION } from "./timeline";

// YouTube Kids: horizontal 16:9. Duración: 4:16 (ver ../guion.md y src/timeline.ts)
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Episodio01Colores"
        component={Episodio01Colores}
        durationInFrames={DURACION * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
