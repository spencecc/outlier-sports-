import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Daily Detail Reports from Outlier Sports — every play, every probability, every edge delivered before first pitch.",
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Daily Detail Reports — delivered before first pitch."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <div
            className="border p-8 mb-12"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-display text-2xl md:text-3xl mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Reports are delivered by email.
            </p>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Each day the model runs, subscribers get a full breakdown before
              first pitch: every play under consideration, the model&apos;s
              probability vs. the market, the edge, and the reasoning. PASS days
              include a brief note on why nothing cleared the threshold.
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              A web archive of past reports is coming soon. Subscribe below to
              get every issue in your inbox — free.
            </p>
            <BeehiivSignup />
          </div>

          <div className="space-y-6">
            {[
              {
                heading: "What's in each report",
                body: "Every play on the board, the model probability, the market's implied probability, the edge at release, and the tier (Standard Edge or High Confidence). High Confidence plays are highlighted.",
              },
              {
                heading: "When it goes out",
                body: "Reports go out daily during the MLB season, typically mid-morning before the first games of the day. No weekend schedule — if there are games, there is a report.",
              },
              {
                heading: "PASS days",
                body: "When the model doesn't find a play worth releasing, subscribers get a short note explaining why. No play is better than a bad play.",
              },
            ].map((item) => (
              <div
                key={item.heading}
                className="border-t pt-6"
                style={{ borderColor: "var(--border)" }}
              >
                <p
                  className="font-sans text-sm font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.heading}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
