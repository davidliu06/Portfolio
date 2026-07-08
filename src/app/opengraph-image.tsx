import { ImageResponse } from "next/og";

export const alt = "David Liu — Mechanical Engineering, Robotics & Rocketry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STARS = [
  { x: 80, y: 90, s: 3 },
  { x: 220, y: 480, s: 2 },
  { x: 340, y: 160, s: 2 },
  { x: 520, y: 60, s: 3 },
  { x: 640, y: 540, s: 2 },
  { x: 760, y: 120, s: 2 },
  { x: 900, y: 320, s: 3 },
  { x: 1020, y: 80, s: 2 },
  { x: 1100, y: 500, s: 3 },
  { x: 460, y: 360, s: 2 },
  { x: 150, y: 300, s: 2 },
  { x: 980, y: 210, s: 2 }
];

/** The 1200x630 social-share card — what LinkedIn/iMessage/Slack render when the portfolio link is posted. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background: "linear-gradient(155deg, #060A18 0%, #0B1120 55%, #101B3A 100%)",
          position: "relative",
          fontFamily: "sans-serif"
        }}
      >
        {/* Star field */}
        {STARS.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              borderRadius: 9999,
              background: "rgba(255,255,255,0.75)"
            }}
          />
        ))}

        {/* Accent glow, upper right */}
        <div
          style={{
            position: "absolute",
            right: -180,
            top: -180,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(47,93,255,0.35) 0%, rgba(47,93,255,0) 70%)"
          }}
        />
        {/* Reticle motif, right side */}
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 175,
            width: 280,
            height: 280,
            borderRadius: 9999,
            border: "2px solid rgba(91,127,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: 190,
              height: 190,
              borderRadius: 9999,
              border: "2px solid rgba(91,127,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#5B7FFF" }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#5B7FFF",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase"
          }}
        >
          <div style={{ width: 44, height: 3, background: "#5B7FFF", display: "flex" }} />
          Mechanical Engineering Portfolio
        </div>

        <div style={{ display: "flex", fontSize: 108, fontWeight: 700, color: "#FFFFFF", marginTop: 18, letterSpacing: -3 }}>
          David Liu
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#A7B4D6", marginTop: 10 }}>
          Robotics · Rocketry · Autonomous Systems
        </div>
        <div style={{ display: "flex", fontSize: 25, color: "#6F7FA6", marginTop: 10, letterSpacing: 1 }}>
          Harvey Mudd College
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["11,423 ft competition rocket", "Field-tested AUV", "AI assistant built-in"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "12px 24px",
                borderRadius: 9999,
                border: "1px solid rgba(91,127,255,0.45)",
                background: "rgba(47,93,255,0.14)",
                color: "#DCE4FF",
                fontSize: 24
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
