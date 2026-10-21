import { Composition } from "remotion";
import { MedusaInmortal } from "./MedusaInmortal";
import { totalFrames } from "./voice";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MedusaInmortal"
        component={MedusaInmortal}
        durationInFrames={1191}
        fps={30}
        width={1080}
        height={1920}
        // La duración real sale de la voz en off (src/voiceover.json)
        calculateMetadata={() => ({ durationInFrames: totalFrames(30) })}
      />
    </>
  );
};
