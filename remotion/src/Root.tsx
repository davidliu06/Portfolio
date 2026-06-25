import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { ExplodedSchematic } from "./ExplodedSchematic";

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
      <Composition
        id="ExplodedSchematic"
        component={ExplodedSchematic}
        defaultProps={{ accentColor: "#FF5D3A" }}
        durationInFrames={120}
        fps={30}
        width={960}
        height={600}
      />
    </>
  );
};
