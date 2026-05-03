"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";
import betsData from "../../../public/data/bets.json";

type Bet = (typeof betsData)[0];
type SortKey = keyof Bet;
type SortDir = "asc" | "desc";
type ResultFilter = "all" | "win" | "loss" | "push" | "pending";
type DateFilter = "all" | "2026" | "last30" | "last7";
type TierFilter = "all" | "High Conviction" | "Standard Edge";

const PAGE_SIZE = 50;

function fmtOdds(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

function fmtClv(n: number | null) {
  if (n === null || n === 0) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}`;
}

function resultLabel(r: string) {
  if (r === "win") return "W";
  if (r === "loss") return "L";
  if (r === "push") return "P";
  return "—";
}

function resultColor(r: string) {
  if (r === "win") return "var(--win)";
  if (r === "loss") return "var(--loss)";
  if (r === "push") return "var(--push)";
  return "var(--text-tertiary)";
}

function rowBorder(r: string) {
  if (r === "win") return "3px solid var(--win)";
  if (r === "loss") return "3px solid var(--loss)";
  if (r === "push") return "3px solid var(--push)";
  return "none";
}

function withinDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

function downloadCsv(rows: Bet[]) {
  const headers = [
    "Date","Sport","Game","Play","Type","Edge %","Odds","Units","Result","CLV",
  ];
  const lines = rows.map((b) =>
    [
      b.date, b.sport, `"${b.game}"`, `"${b.play}"`,
      b.type, b.edge, b.odds, b.units, b.result, b.clv ?? "",
    ].join(",")
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "outlier-sports-bet-log.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function BetLogPage() {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [sportFilter, setSportFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    let rows = [...betsData] as Bet[];

    if (sportFilter !== "all")
      rows = rows.filter((b) => b.sport === sportFilter);
    if (resultFilter !== "all")
      rows = rows.filter((b) => b.result === resultFilter);
    if (dateFilter === "2026")
      rows = rows.filter((b) => b.date.startsWith("2026"));
    if (dateFilter === "last30")
      rows = rows.filter((b) => withinDays(b.date, 30));
    if (dateFilter === "last7")
      rows = rows.filter((b) => withinDays(b.date, 7));
    if (tierFilter !== "all")
      rows = rows.filter((b) => (b as Bet & { tier?: string }).tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (b) =>
          b.game.toLowerCase().includes(q) ||
          b.play.toLowerCase().includes(q) ||
          b.sport.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [sportFilter, resultFilter, dateFilter, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sports = ["all", ...Array.from(new Set(betsData.map((b) => b.sport)))];

  function SortHeader({
    label,
    col,
    right = false,
  }: {
    label: string;
    col: SortKey;
    right?: boolean;
  }) {
    const active = sortKey === col;
    return (
      <th
        className={`py-3 px-3 text-xs uppercase tracking-wider font-normal cursor-pointer select-none whitespace-nowrap ${right ? "text-right" : "text-left"}`}
        style={{
          color: active ? "var(--accent)" : "var(--text-tertiary)",
          borderBottom: `1px solid var(--border)`,
        }}
        onClick={() => handleSort(col)}
      >
        {label} {active ? (sortDir === "asc" ? "↑" : "↓") : ""}
      </th>
    );
  }

  return (
    <>
      <PageHeader
        title="Bet Log"
        subhead="Every play released, in order. Click any column header to sort."
      />

      {/* ── Filter bar ─────────────────────────────────────────────────────── */}
      <div
        className="border-y px-6 py-4"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          {/* Sport */}
          <select
            value={sportFilter}
            onChange={(e) => { setSportFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 text-xs font-mono border outline-none"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {sports.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Sports" : s}
              </option>
            ))}
          </select>

          {/* Result */}
          <select
            value={resultFilter}
            onChange={(e) => { setResultFilter(e.target.value as ResultFilter); setPage(1); }}
            className="px-3 py-1.5 text-xs font-mono border outline-none"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {(["all", "win", "loss", "push", "pending"] as ResultFilter[]).map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All Results" : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          {/* Date range */}
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value as DateFilter); setPage(1); }}
            className="px-3 py-1.5 text-xs font-mono border outline-none"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <option value="all">All Time</option>
            <option value="2026">2026 Season</option>
            <option value="last30">Last 30 Days</option>
            <option value="last7">Last 7 Days</option>
          </select>

          {/* Tier */}
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value as TierFilter); setPage(1); }}
            className="px-3 py-1.5 text-xs font-mono border outline-none"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <option value="all">All Tiers</option>
            <option value="High Conviction">High Conviction</option>
            <option value="Standard Edge">Standard Edge</option>
          </select>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search game or play…"
            className="px-3 py-1.5 text-xs font-mono border outline-none flex-1 min-w-40"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />

          {/* CSV export */}
          <button
            onClick={() => downloadCsv(filtered)}
            className="ml-auto px-4 py-1.5 text-xs font-sans uppercase tracking-wider border transition-colors duration-150 whitespace-nowrap"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono tabular border-collapse">
            <thead>
              <tr>
                <SortHeader label="Date" col="date" />
                <SortHeader label="Sport" col="sport" />
                <SortHeader label="Game" col="game" />
                <SortHeader label="Play" col="play" />
                <SortHeader label="Edge %" col="edge" right />
                <SortHeader label="Odds" col="odds" right />
                <SortHeader label="Result" col="result" right />
                <SortHeader label="Units" col="units" right />
                <SortHeader label="CLV" col="clv" right />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center font-sans text-sm"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    No bets match the current filters.
                  </td>
                </tr>
              ) : (
                pageRows.map((bet) => (
                  <tr
                    key={bet.id}
                    className="border-b"
                    style={{
                      borderColor: "var(--border)",
                      borderLeft: rowBorder(bet.result),
                      fontStyle: bet.result === "pending" ? "italic" : "normal",
                    }}
                  >
                    <td className="py-2.5 px-3" style={{ color: "var(--text-tertiary)" }}>
                      {bet.date}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                      {bet.sport}
                    </td>
                    <td className="py-2.5 px-3 max-w-48 truncate" style={{ color: "var(--text-primary)" }}>
                      {bet.game}
                    </td>
                    <td className="py-2.5 px-3 max-w-48" style={{ color: "var(--text-secondary)" }}>
                      <span className="truncate block">{bet.play}</span>
                      {(bet as Bet & { tier?: string }).tier === "High Conviction" && (
                        <span
                          className="text-xs font-sans uppercase tracking-wider px-1 py-px"
                          style={{ color: "var(--accent)", border: "1px solid var(--accent)", fontSize: "9px" }}
                        >
                          HC
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: "var(--text-secondary)" }}>
                      {bet.edge.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: "var(--text-secondary)" }}>
                      {fmtOdds(bet.odds)}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-semibold"
                      style={{ color: resultColor(bet.result) }}
                    >
                      {resultLabel(bet.result)}
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: "var(--text-secondary)" }}>
                      {bet.units.toFixed(1)}u
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: "var(--text-tertiary)" }}>
                      {fmtClv(bet.clv)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
              {filtered.length} bets · page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-mono border disabled:opacity-30"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-mono border disabled:opacity-30"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Footer note */}
        <p className="text-xs mt-6" style={{ color: "var(--text-tertiary)" }}>
          Lines reflect the price available at the time of release on the listed
          sportsbook. CLV measures the difference between release line and
          closing line.
        </p>
      </div>

      {/* ── Signup ─────────────────────────────────────────────────────────── */}
      <section
        className="border-t"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <p className="font-display text-2xl mb-6" style={{ color: "var(--text-primary)" }}>
            Get every play before it happens.
          </p>
          <BeehiivSignup />
        </div>
      </section>
    </>
  );
}
