import { Composition } from "remotion";
import { MedusaInmortal } from "./MedusaInmortal";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MedusaInmortal"
        component={MedusaInmortal}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
