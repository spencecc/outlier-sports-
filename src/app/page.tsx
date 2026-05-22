import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import StatCard from "@/components/StatCard";
import ReportCard from "@/components/ReportCard";
import BeehiivSignup from "@/components/BeehiivSignup";
import { getRssPosts } from "@/lib/getRssPosts";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Copacetic Sports | Sports Betting Research",
  description:
    "Simulation-driven sports betting research focused on pricing, probabilities, and disciplined decision-making.",
};

export default async function HomePage() {
  const [statsRaw, recentReports] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "public", "data", "stats.json"), "utf-8"),
    getRssPosts(3),
  ]);
  const statsRes = JSON.parse(statsRaw);
  const { lifetime, season2026, higherModelConf } = statsRes;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-12">
          <div className="max-w-3xl">
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-fade-up"
              style={{ color: "var(--text-primary)", animationDelay: "0ms" }}
            >
              50,000 Simulations.
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
          <div className="hidden md:flex flex-shrink-0 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Copacetic Sports"
              width={340}
              height={340}
              className="opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ── Standard Model Confidence ──────────────────────────────────────── */}
      {statsRes.byEdgeZone && (() => {
        const std = statsRes.byEdgeZone.find((r: { range: string }) => r.range === "7-10%");
        if (!std) return null;
        return (
          <section className="border-b" style={{ borderColor: "var(--border)" }}>
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
              <p className="text-xs font-sans uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
                Standard Model Confidence
              </p>
              <p className="text-xs font-mono mb-4" style={{ color: "var(--accent)" }}>
                7–10% edge — fully graded and tracked
              </p>
            </div>
            <div className="max-w-7xl mx-auto px-6 pb-2">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <StatCard value={std.record} label="Record" />
                <StatCard value={`${std.winPct.toFixed(1)}%`} label="Win Rate" />
                <StatCard value={`${std.roi >= 0 ? "+" : ""}${std.roi.toFixed(1)}%`} label="ROI" valueColor={std.roi >= 0 ? "var(--win)" : "var(--loss)"} />
                <StatCard value={`${std.units >= 0 ? "+" : ""}${std.units.toFixed(1)}u`} label="Units" valueColor={std.units >= 0 ? "var(--win)" : "var(--loss)"} />
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Higher Model Confidence ────────────────────────────────────────── */}
      {higherModelConf && (
        <section className="border-b" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
            <p
              className="text-xs font-sans uppercase tracking-widest mb-1"
              style={{ color: "var(--accent)" }}
            >
              Higher Model Confidence
            </p>
            <p
              className="text-xs font-mono mb-4"
              style={{ color: "var(--accent)" }}
            >
              10%+ edge — fully graded and tracked
            </p>
          </div>
          <div className="max-w-7xl mx-auto px-6 pb-2">
            <div className="grid grid-cols-2 md:grid-cols-4">
              <StatCard
                value={higherModelConf.record}
                label="Record"
              />
              <StatCard
                value={`${higherModelConf.winPct.toFixed(1)}%`}
                label="Win Rate"
              />
              <StatCard
                value={`${higherModelConf.roi >= 0 ? "+" : ""}${higherModelConf.roi.toFixed(1)}%`}
                label="ROI"
                valueColor={higherModelConf.roi >= 0 ? "var(--win)" : "var(--loss)"}
              />
              <StatCard
                value={`${higherModelConf.units >= 0 ? "+" : ""}${higherModelConf.units.toFixed(1)}u`}
                label="Units"
                valueColor={higherModelConf.units >= 0 ? "var(--win)" : "var(--loss)"}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Methodology teaser ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {[
            {
              n: "01",
              heading: "Simulate.",
              body: "Every game runs through 50,000 Monte Carlo simulations using team-level efficiency metrics, contextual modifiers, and real-time inputs. The model produces a probability distribution, not a single point estimate.",
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
      {recentReports.length > 0 && (
        <section className="border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
            <h2
              className="font-display text-3xl md:text-4xl mb-10"
              style={{ color: "var(--text-primary)" }}
            >
              Latest Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentReports.map((report, i) => (
                <ReportCard
                  key={i}
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
      )}

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
            Every play, every probability, every edge — plus a full breakdown
            of every game. Delivered before first pitch. Free.
          </p>
          <BeehiivSignup />
        </div>
      </section>
    </>
  );
}
