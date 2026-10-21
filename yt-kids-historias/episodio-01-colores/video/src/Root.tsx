import { Composition } from "remotion";
import { Episodio01Colores, PRUEBA_25D, Prueba25D } from "./Episodio01Colores";
import { PRUEBA_3D, Prueba3D } from "./Prueba3D";
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
      {/* Pruebas de estilo para decidir cómo sigue la serie */}
      <Composition
        id="Prueba25D"
        component={Prueba25D}
        durationInFrames={(PRUEBA_25D.hasta - PRUEBA_25D.desde) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Prueba3D"
        component={Prueba3D}
        durationInFrames={(PRUEBA_3D.hasta - PRUEBA_3D.desde) * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
