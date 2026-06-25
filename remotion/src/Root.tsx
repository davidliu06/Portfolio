import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IgnitionMark"
        component={MyComposition}
        durationInFrames={90}
        fps={30}
        width={600}
        height={600}
      />
    </>
  );
};
