"use client";

import { useState } from "react";
import StatCard from "@/components/StatCard";
import StatsTable from "@/components/StatsTable";
import BeehiivSignup from "@/components/BeehiivSignup";
import Link from "next/link";

type Period = "lifetime" | "season2026" | "last30Days" | "last7Days";

interface PeriodStats {
  record: string;
  winPct: number;
  roi: number;
  units: number;
}

interface BreakdownRow {
  range?: string;
  sport?: string;
  type?: string;
  tier?: string;
  bets: number;
  record: string;
  winPct: number;
  roi: number;
  units: number;
}

interface Props {
  lifetime: PeriodStats;
  season2026: PeriodStats;
  last30Days: PeriodStats;
  last7Days: PeriodStats;
  byEdgeZone: BreakdownRow[];
  bySport: BreakdownRow[];
  byPlayType: BreakdownRow[];
  higherModelConf: { record: string; winPct: number; roi: number; units: number };
}

const PERIODS: { key: Period; label: string }[] = [
  { key: "lifetime", label: "All Time" },
  { key: "season2026", label: "2026 Season" },
  { key: "last30Days", label: "Last 30 Days" },
  { key: "last7Days", label: "Last 7 Days" },
];

function signed(n: number, suffix: string) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}${suffix}`;
}

export default function TrackRecordClient({
  lifetime,
  season2026,
  last30Days,
  last7Days,
  byEdgeZone,
  bySport,
  byPlayType,
  higherModelConf,
}: Props) {
  const [period, setPeriod] = useState<Period>("lifetime");

  const data = { lifetime, season2026, last30Days, last7Days }[period];

  return (
    <>
      {/* ── Headline stats ─────────────────────────────────────────────────── */}
      <section className="border-y" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCard value={data.record} label="Record" />
            <StatCard value={`${data.winPct.toFixed(1)}%`} label="Win Rate" />
            <StatCard value={signed(data.roi, "%")} label="ROI" />
            <StatCard value={signed(data.units, "u")} label="Units" />
          </div>
        </div>
      </section>

      {/* ── Filter toggles ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-2">
        <div className="flex flex-wrap gap-2">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className="px-4 py-1.5 text-xs font-sans uppercase tracking-wider border transition-colors duration-150"
              style={{
                borderColor: period === key ? "var(--accent)" : "var(--border)",
                backgroundColor:
                  period === key ? "var(--accent)" : "transparent",
                color:
                  period === key ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Breakdown tables ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* Standard Model Confidence — 7-10% edge */}
        {(() => {
          const std = byEdgeZone.find((r) => r.range === "7-10%");
          if (!std) return null;
          return (
            <div>
              <p
                className="text-xs font-sans uppercase tracking-widest mb-1"
                style={{ color: "var(--accent)" }}
              >
                Standard Model Confidence
              </p>
              <p
                className="text-xs font-mono mb-4"
                style={{ color: "var(--accent)" }}
              >
                7–10% edge signals — fully graded and tracked
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4">
                <StatCard value={std.record} label="Record" />
                <StatCard value={`${std.winPct.toFixed(1)}%`} label="Win Rate" />
                <StatCard
                  value={signed(std.roi, "%")}
                  label="ROI"
                  valueColor={std.roi >= 0 ? "var(--win)" : "var(--loss)"}
                />
                <StatCard
                  value={signed(std.units, "u")}
                  label="Units"
                  valueColor={std.units >= 0 ? "var(--win)" : "var(--loss)"}
                />
              </div>
            </div>
          );
        })()}

        {/* Higher Model Confidence — 10%+ edge */}
        <div>
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
            10%+ edge signals — fully graded and tracked
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4">
            <StatCard value={higherModelConf.record} label="Record" />
            <StatCard value={`${higherModelConf.winPct.toFixed(1)}%`} label="Win Rate" />
            <StatCard
              value={signed(higherModelConf.roi, "%")}
              label="ROI"
              valueColor={higherModelConf.roi >= 0 ? "var(--win)" : "var(--loss)"}
            />
            <StatCard
              value={signed(higherModelConf.units, "u")}
              label="Units"
              valueColor={higherModelConf.units >= 0 ? "var(--win)" : "var(--loss)"}
            />
          </div>
        </div>

        {/* Performance by sport */}
        <div>
          <h2
            className="font-display text-2xl md:text-3xl mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Performance by Sport
          </h2>
          <StatsTable
            rows={bySport.map((r) => ({
              label: r.sport ?? "",
              bets: r.bets,
              record: r.record,
              winPct: r.winPct,
              roi: r.roi,
              units: r.units,
            }))}
          />
        </div>

        {/* Performance by play type */}
        <div>
          <h2
            className="font-display text-2xl md:text-3xl mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Performance by Play Type
          </h2>
          <StatsTable
            rows={byPlayType.map((r) => ({
              label: r.type ?? "",
              bets: r.bets,
              record: r.record,
              winPct: r.winPct,
              roi: r.roi,
              units: r.units,
            }))}
          />
        </div>

      </div>

      {/* ── CTA strip ─────────────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <p
              className="font-display text-2xl md:text-3xl mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Want every bet, every result, every line?
            </p>
            <Link
              href="/bet-log"
              className="inline-block mt-3 px-6 py-3 text-sm font-sans uppercase tracking-wider transition-colors duration-150"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-primary)",
              }}
            >
              View Full Bet Log →
            </Link>
          </div>
          <div className="md:max-w-sm w-full">
            <p
              className="text-sm mb-4"
              style={{ color: "var(--text-secondary)" }}
            >
              Get every play before first pitch — plus a full breakdown of every game.
            </p>
            <BeehiivSignup />
          </div>
        </div>
      </section>
    </>
  );
}
