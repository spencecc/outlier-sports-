import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About | Copacetic Sports",
  description:
    "Copacetic Sports is built and operated by Spencer Campbell — a data and analytics professional applying disciplined probabilistic thinking to sports betting markets.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About"
        subhead="Who builds this and why."
      />

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl space-y-6 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>

            <p>
              Copacetic Sports is built and operated by a CRM and retention
              analytics professional with over 15 years of experience building
              data products in the retail, healthcare, and marketing services
              industries.
            </p>

            <p>
              The model started as a personal research project — an attempt to
              apply the same probabilistic thinking and disciplined process from
              professional analytics work to a market where most
              consumer-facing products are tout services without transparency.
            </p>

            <p>
              Copacetic publishes everything: every play, every probability,
              every result. No locks, no cherry-picked runs, no &ldquo;premium
              picks&rdquo; hiding the misses. The point is to demonstrate that a
              disciplined model with honest accounting can find real edge — and
              to make that work freely available.
            </p>

            <p>
              Premium subscriptions are planned for the All-Star break in
              mid-July 2026, contingent on the lifetime sample continuing to
              show edge.
            </p>

            <div
              className="border-t pt-6 mt-8 space-y-2 text-sm font-mono"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <p>
                <span style={{ color: "var(--text-tertiary)" }}>Contact —</span>{" "}
                <a
                  href="https://x.com/CopaceticSports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 transition-colors duration-150"
                  style={{ color: "var(--text-secondary)" }}
                >
                  @CopaceticSports
                </a>{" "}
                on X
              </p>
              <p>
                <span style={{ color: "var(--text-tertiary)" }}>Support —</span>{" "}
                <Link
                  href="/support"
                  className="underline underline-offset-4 transition-colors duration-150"
                  style={{ color: "var(--text-secondary)" }}
                >
                  copaceticsports.com/support
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
