import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Copacetic Sports finds the games the market got wrong. Monte Carlo simulation, edge-based play selection, and closing line value verification.",
};

function Section({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      {title && (
        <h2
          className="font-display text-2xl md:text-3xl mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
      )}
      <div
        className="text-base leading-relaxed space-y-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {children}
      </div>
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <>
      <PageHeader
        title="Methodology"
        subhead="How Copacetic Sports finds the games the market got wrong."
      />

      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">

          {/* The model */}
          <Section title="The Model">
            <p>
              Copacetic&apos;s core engine is a Monte Carlo simulation. For every
              game on the slate, the model generates fifty thousand simulated
              outcomes built from team-level efficiency, recent form, contextual
              factors, and real-time inputs. The output isn&apos;t a prediction
              — it&apos;s a probability distribution.
            </p>
            <p>
              That distribution is then compared against the market&apos;s
              implied odds at major sportsbooks. The gap between the
              model&apos;s probability and the market&apos;s implied probability
              is the edge. When the edge is meaningful — and only when it&apos;s
              meaningful — a play is released.
            </p>
          </Section>

          {/* Inputs */}
          <div className="max-w-2xl">
            <h2
              className="font-display text-2xl md:text-3xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Inputs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  heading: "Efficiency Metrics",
                  body: "Team-level offensive and defensive ratings, adjusted for opponent and pace.",
                },
                {
                  heading: "Contextual Modifiers",
                  body: "Rest, travel, schedule density, weather where applicable, park factors for MLB, surface and altitude where relevant.",
                },
                {
                  heading: "Real-Time Inputs",
                  body: "Starting pitcher confirmations, lineup releases, injury news, late scratches.",
                },
              ].map((item) => (
                <div key={item.heading}>
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

          {/* Discipline */}
          <Section title="Discipline">
            <p>
              A model is only as good as the discipline applied to it. Copacetic
              applies hard guardrails on every play: minimum edge required,
              position sizing tied to confidence, and overrides for situational
              factors that the model alone can&apos;t see — back-to-back
              fatigue, key injuries, and starting pitcher news among them. Plays
              that don&apos;t clear every check don&apos;t get released.
            </p>
          </Section>

          {/* Verification */}
          <Section title="Verification">
            <p>
              Every play is logged the moment it&apos;s released, with the line
              and the edge captured at release. After the game closes, two
              things are recorded: the result, and the closing line. Closing
              line value — the difference between the line at release and the
              line at close — is the long-run signal that the edge was real.
              Copacetic Sports publishes both.
            </p>
          </Section>

          {/* What Outlier is not */}
          <Section title="What Copacetic Is Not">
            <p>
              Copacetic is not a lock service. It&apos;s not
              &ldquo;guaranteed winners.&rdquo; Sports betting involves
              variance, and any honest analytical product loses some weeks. The
              point of the model is positive expected value across thousands of
              plays, not a perfect record across ten.
            </p>
            <p>
              Read the{" "}
              <Link
                href="/track-record"
                className="underline underline-offset-2 transition-colors duration-150"
                style={{ color: "var(--text-primary)" }}
              >
                track record
              </Link>{" "}
              and decide for yourself.
            </p>
          </Section>

          {/* Divider before signup */}
          <div
            className="border-t pt-16"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-display text-2xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Get the Daily Detail Report.
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Every play, every probability, every edge — delivered before first
              pitch. Free.
            </p>
            <BeehiivSignup />
          </div>

        </div>
      </div>
    </>
  );
}
