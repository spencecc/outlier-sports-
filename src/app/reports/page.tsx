import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Deep daily analysis from Copacetic Sports — pitcher breakdowns, weather, park factors, and the full model output behind each play.",
};

const sections = [
  {
    heading: "Pitcher breakdown",
    body: "Starting pitcher FIP, WHIP, walk rate, recent fatigue, and how the model weights the matchup. This is where the edge usually lives.",
  },
  {
    heading: "Weather & environment",
    body: "Wind direction, temperature, humidity, and park factor adjustments. A 10 mph wind to left at Wrigley is a different game than a 10 mph wind in.",
  },
  {
    heading: "Bullpen status",
    body: "Leverage usage over the last 3 days, closers on back-to-back, and how bullpen depth affects late-game probability in close games.",
  },
  {
    heading: "Full model output",
    body: "Model probability vs. market implied probability for every game the model evaluated. Every play, every pass, and the margin that drove the decision.",
  },
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Deep daily analysis — pitchers, weather, model output."
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
              Coming soon.
            </p>
            <p
              className="text-base leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Daily reports are in development. Each report will cover the full
              analytical picture behind the day&apos;s plays — pitcher matchups,
              weather adjustments, bullpen status, and the complete model output
              for every game evaluated.
            </p>
            <p
              className="text-sm mb-8"
              style={{ color: "var(--text-secondary)" }}
            >
              Subscribe below to get notified when reports launch, plus the daily
              email in your inbox every morning.
            </p>
            <BeehiivSignup />
          </div>

          <div className="space-y-6">
            {sections.map((item) => (
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
