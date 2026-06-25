import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const COBALT = "#2F5DFF";
const VIOLET = "#8B5CF6";
const CORAL = "#FF5D3A";

function Orbiter({ color, phase, radius }: { color: string; phase: number; radius: number }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const angle = (frame / durationInFrames) * Math.PI * 2 + phase;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const pulse = 0.85 + 0.15 * Math.sin(angle * 3);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: color,
        translate: `${x - 14}px ${y - 14}px`,
        scale: pulse,
        boxShadow: `0 0 28px 6px ${color}99`
      }}
    />
  );
}

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cycle = (frame / durationInFrames) * Math.PI * 2;
  const glow = 0.6 + 0.4 * Math.sin(cycle);

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Orbiter color={COBALT} phase={0} radius={150} />
        <Orbiter color={VIOLET} phase={(Math.PI * 2) / 3} radius={150} />
        <Orbiter color={CORAL} phase={(Math.PI * 4) / 3} radius={150} />

        <div
          style={{
            fontFamily: "Outfit, Arial, sans-serif",
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: -2,
            color: "#0B1220",
            scale: 0.96 + glow * 0.04,
            textShadow: `0 0 ${20 + glow * 30}px rgba(47, 93, 255, ${0.25 + glow * 0.25})`
          }}
        >
          DL
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
