import { ImageResponse } from "next/og";

export const alt = "Outlier Sports — 50,000 Simulations. Find the Outliers.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              color: "#f5f5f0",
              fontSize: "36px",
              fontWeight: 400,
              letterSpacing: "-0.5px",
            }}
          >
            Outlier Sports
          </span>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#e85d26",
              marginLeft: "4px",
              marginBottom: "-8px",
            }}
          />
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#f5f5f0",
            fontSize: "72px",
            fontWeight: 400,
            lineHeight: 1.1,
            marginBottom: "32px",
            maxWidth: "900px",
          }}
        >
          50,000 Simulations.
          <br />
          Find the Outliers.
        </div>

        {/* Subhead */}
        <div
          style={{
            color: "#888880",
            fontSize: "28px",
            fontWeight: 400,
            maxWidth: "700px",
          }}
        >
          A Monte Carlo model that finds the games the market got wrong.
        </div>

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "#e85d26",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
