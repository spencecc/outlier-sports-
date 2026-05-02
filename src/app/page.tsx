import type { Metadata } from "next";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import ReportCard from "@/components/ReportCard";
import BeehiivSignup from "@/components/BeehiivSignup";
import stats from "../../public/data/stats.json";

export const metadata: Metadata = {
  title: "Outlier Sports — 10,000 Simulations. Find the Outliers.",
  description:
    "A Monte Carlo sports model that surfaces the games where the market is wrong. Daily picks, fully transparent track record, free.",
};

/**
 * PHASE 3: Replace placeholder reports with real data fetched from Beehiiv RSS.
 * Fetch pattern lives in /app/reports/page.tsx once that route is built.
 */
const placeholderReports = [
  {
    id: "1",
    title: "Detail Report — May 2, 2026",
    date: "May 2, 2026",
    excerpt:
      "Four plays on the board today. Two run lines, one total, one ML. Model is heaviest on the Astros/Mariners under given current starters.",
    url: "#",
  },
  {
    id: "2",
    title: "Detail Report — May 1, 2026",
    date: "May 1, 2026",
    excerpt:
      "Two plays released. Red Sox run line held in a 4-3 game. Dodgers ML missed — model flagged the edge but the bullpen situation flipped late.",
    url: "#",
  },
  {
    id: "3",
    title: "Detail Report — April 30, 2026",
    date: "April 30, 2026",
    excerpt:
      "Light slate. One play: Astros/Mariners under. Starter efficiency metrics and ballpark factors both pointed the same direction.",
    url: "#",
  },
];

export default function HomePage() {
  const { lifetime } = stats;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <h1
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-fade-up"
            style={{ color: "var(--text-primary)", animationDelay: "0ms" }}
          >
            10,000 Simulations.
            <br />
            Find the Outliers.
          </h1>
          <p
            className="text-lg md:text-xl leading-relaxed mb-10 animate-fade-up"
            style={{
              color: "var(--text-secondary)",
              animationDelay: "200ms",
            }}
          >
            A Monte Carlo sports model that surfaces the games where the market
            is wrong. Daily picks, fully transparent track record, free.
          </p>
          <div
            className="flex flex-wrap items-center gap-6 animate-fade-up"
            style={{ animationDelay: "400ms" }}
          >
            <a
              href="#signup"
              className="inline-block px-6 py-3 text-sm font-sans uppercase tracking-wider transition-colors duration-150"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-primary)",
              }}
            >
              Get the Free Daily Report →
            </a>
            <Link
              href="/track-record"
              className="text-sm transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
            >
              See the track record →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stat strip ─────────────────────────────────────────────────────── */}
      <section className="border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCard
              value={lifetime.record}
              label="Record"
              caption="Lifetime · MLB"
            />
            <StatCard
              value={`${lifetime.winPct.toFixed(1)}%`}
              label="Win Rate"
              caption="Lifetime · MLB"
            />
            <StatCard
              value={`${lifetime.roi >= 0 ? "+" : ""}${lifetime.roi.toFixed(1)}%`}
              label="ROI"
              caption="Lifetime · MLB"
            />
            <StatCard
              value={`${lifetime.units >= 0 ? "+" : ""}${lifetime.units.toFixed(1)}u`}
              label="Units"
              caption="Lifetime · MLB"
            />
          </div>
        </div>
      </section>

      {/* ── Methodology teaser ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {[
            {
              n: "01",
              heading: "Simulate.",
              body: "Every game runs through 10,000 Monte Carlo simulations using team-level efficiency metrics, contextual modifiers, and real-time inputs. The model produces a probability distribution, not a single point estimate.",
            },
            {
              n: "02",
              heading: "Compare.",
              body: "The model's probabilities are compared against the market's implied odds. The gap between them is the edge. Plays are only released when the edge clears a disciplined threshold.",
            },
            {
              n: "03",
              heading: "Track.",
              body: "Every play is logged publicly: the bet, the edge at release, the closing line, and the result. Closing line value is tracked to verify the edge was real, not lucky.",
            },
          ].map((item) => (
            <div key={item.n}>
              <p
                className="font-mono text-xs tracking-widest mb-4 tabular"
                style={{ color: "var(--accent)" }}
              >
                {item.n}
              </p>
              <h3
                className="font-display text-2xl md:text-3xl mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {item.heading}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/methodology"
            className="text-sm transition-colors duration-150"
            style={{ color: "var(--text-secondary)" }}
          >
            Read the full methodology →
          </Link>
        </div>
      </section>

      {/* ── Recent reports ─────────────────────────────────────────────────── */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2
            className="font-display text-3xl md:text-4xl mb-10"
            style={{ color: "var(--text-primary)" }}
          >
            Latest Reports
          </h2>
          {/* PHASE 3: Replace placeholder cards with real ReportCard components
              built from the Beehiiv RSS feed. Fetch pattern: server-side fetch
              of https://[pub].beehiiv.com/feed, parse with fast-xml-parser,
              pass top 3 items here. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {placeholderReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                date={report.date}
                excerpt={report.excerpt}
                url={report.url}
              />
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/reports"
              className="text-sm transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
            >
              View all reports →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Email signup ───────────────────────────────────────────────────── */}
      <section
        id="signup"
        className="border-t"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <h2
            className="font-display text-3xl md:text-4xl mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Get the Daily Detail Report.
          </h2>
          <p
            className="text-base mb-8 max-w-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            Every play, every probability, every edge — delivered before first
            pitch. Free.
          </p>
          <BeehiivSignup />
        </div>
      </section>
    </>
  );
}
