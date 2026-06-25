import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

const BLUEPRINT_GRID = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
  backgroundSize: "32px 32px"
};

type Phase = { from: number; to: number };

/** 0 -> 1 -> 0 across the explode/hold/reassemble window, easing both ways, flat at 0 outside it — used to drive how far apart each piece is. */
function explodeAmount(frame: number, explode: Phase, hold: Phase, reassemble: Phase) {
  if (frame < explode.from) return 0;
  if (frame < explode.to) return interpolate(frame, [explode.from, explode.to], [0, 1], { easing: Easing.out(Easing.cubic) });
  if (frame < hold.to) return 1;
  if (frame < reassemble.to) return interpolate(frame, [reassemble.from, reassemble.to], [1, 0], { easing: Easing.in(Easing.cubic) });
  return 0;
}

function CornerTick({ style }: { style: React.CSSProperties }) {
  return <div style={{ position: "absolute", width: 28, height: 28, borderColor: "rgba(255,255,255,0.3)", ...style }} />;
}

export function ExplodedSchematic({ accentColor = "#FF5D3A" }: { accentColor?: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const explode: Phase = { from: durationInFrames * 0.18, to: durationInFrames * 0.42 };
  const hold: Phase = { from: explode.to, to: durationInFrames * 0.62 };
  const reassemble: Phase = { from: hold.to, to: durationInFrames * 0.86 };

  const t = explodeAmount(frame, explode, hold, reassemble);
  const spin = interpolate(frame, [0, durationInFrames], [0, 14]);

  const nosecone = -90 * t;
  const fins = 70 * t;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0B1120, #060912)" }}>
      <AbsoluteFill style={BLUEPRINT_GRID} />
      <CornerTick style={{ top: 28, left: 28, borderTop: "2px solid", borderLeft: "2px solid" }} />
      <CornerTick style={{ top: 28, right: 28, borderTop: "2px solid", borderRight: "2px solid" }} />
      <CornerTick style={{ bottom: 28, left: 28, borderBottom: "2px solid", borderLeft: "2px solid" }} />
      <CornerTick style={{ bottom: 28, right: 28, borderBottom: "2px solid", borderRight: "2px solid" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <svg
          height="320"
          style={{ transform: `rotate(${spin}deg)`, overflow: "visible" }}
          viewBox="0 0 160 320"
          width="160"
        >
          <polygon fill="#E2E8F0" points="80,0 130,90 30,90" transform={`translate(0 ${nosecone})`} />
          <rect fill="#CBD5E1" height="140" width="80" x="40" y="90" />
          <rect fill={accentColor} height="10" opacity={0.9} width="80" x="40" y="150" />
          <polygon fill="#94A3B8" points="40,230 10,280 40,260" transform={`translate(0 ${fins})`} />
          <polygon fill="#94A3B8" points="120,230 150,280 120,260" transform={`translate(0 ${fins})`} />
          <rect fill="#475569" height="30" width="80" x="40" y="230" />
        </svg>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: 36,
          color: "#94A3B8",
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase"
        }}
      >
        EXPLODED VIEW
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 36,
          color: accentColor,
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: 2,
          textTransform: "uppercase"
        }}
      >
        REV · A
      </div>
    </AbsoluteFill>
  );
}
