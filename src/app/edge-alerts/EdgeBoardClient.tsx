"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModelEdge {
  sport: string;
  game_id: string;
  game: string;
  market: string;
  side: string;
  best_book: string;
  market_odds: string;
  model_fair_line: string;
  model_probability: number;
  market_probability: number;
  edge: number;
  ev: number;
  tier: string;
  signal: string;
  model_alignment: string;
  updated_at: string;
}

interface DiscrepancyOutcome {
  outcome: string;
  book: string;
  odds: string;
  decimal_odds: number;
}

interface BookDiscrepancy {
  sport: string;
  game_id: string;
  game: string;
  market: string;
  outcomes: DiscrepancyOutcome[];
  implied_probability_sum: number;
  arb_return: number;
  signal: string;
  model_alignment: string;
  updated_at: string;
}

interface LineMovement {
  sport: string;
  game_id: string;
  game: string;
  market: string;
  side: string;
  open_odds: string;
  current_odds: string;
  move: string;
  direction: string;
  model_fair_line: string;
  signal: string;
  alert?: string;
  updated_at: string;
}

interface EdgeAlertData {
  as_of: string;
  date: string;
  version: string;
  sports: string[];
  summary: {
    model_edges: number;
    book_discrepancies: number;
    line_movements: number;
    warnings?: string[];
  };
  model_edges: ModelEdge[];
  book_discrepancies: BookDiscrepancy[];
  line_movements: LineMovement[];
  _note?: string;
}

type Tab = "model_edges" | "book_discrepancies" | "line_movements" | "archived";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isStale(asOf: string): boolean {
  const updated = new Date(asOf).getTime();
  const now = Date.now();
  return now - updated > 240 * 60 * 1000;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/New_York",
    timeZoneName: "short",
  });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });
}

function fmtPct(n: number): string {
  return (n * 100).toFixed(1) + "%";
}

function fmtEdge(n: number): string {
  return "+" + (n * 100).toFixed(1) + "%";
}

function fmtArb(n: number): string {
  return "+" + (n * 100).toFixed(1) + "%";
}

function tierStyle(tier: string): string {
  if (tier === "A") return "var(--win)";
  if (tier === "B") return "var(--accent)";
  if (tier === "C") return "#B8A040";
  return "var(--text-tertiary)";
}

function alignmentStyle(a: string): string {
  if (a === "Model-backed") return "var(--win)";
  if (a === "Mixed") return "#B8A040";
  if (a === "Not model-backed") return "var(--text-secondary)";
  return "var(--text-tertiary)";
}

function directionStyle(d: string): string {
  if (d === "Toward model") return "var(--win)";
  if (d === "Away from model") return "var(--loss)";
  return "var(--text-tertiary)";
}

function alertStyle(a: string | undefined): string {
  if (a === "Steam") return "var(--accent)";
  if (a === "Stale book") return "var(--loss)";
  if (a === "Drift") return "#B8A040";
  return "var(--text-tertiary)";
}

// ── Helper sub-components ─────────────────────────────────────────────────────

function ThLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="py-3 px-3 text-xs uppercase tracking-wider font-normal text-left whitespace-nowrap"
      style={{
        color: "var(--text-tertiary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </th>
  );
}

function ThRight({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="py-3 px-3 text-xs uppercase tracking-wider font-normal text-right whitespace-nowrap"
      style={{
        color: "var(--text-tertiary)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </th>
  );
}

function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td
        colSpan={cols}
        className="py-12 text-center text-xs font-mono"
        style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}
      >
        {message}
      </td>
    </tr>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-1.5 text-xs font-mono border outline-none"
      style={{
        backgroundColor: "var(--bg-surface-2)",
        borderColor: "var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ── Table components ──────────────────────────────────────────────────────────

function ModelEdgesTable({ rows }: { rows: ModelEdge[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono tabular border-collapse">
        <thead>
          <tr>
            <ThLabel>Sport</ThLabel>
            <ThLabel>Game</ThLabel>
            <ThLabel>Market</ThLabel>
            <ThLabel>Side</ThLabel>
            <ThLabel>Best Book</ThLabel>
            <ThRight>Market Odds</ThRight>
            <ThRight>Fair Line</ThRight>
            <ThRight>Model Prob</ThRight>
            <ThRight>Mkt Prob</ThRight>
            <ThRight>Edge</ThRight>
            <ThLabel>Tier</ThLabel>
            <ThLabel>Alignment</ThLabel>
            <ThLabel>Updated</ThLabel>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow
              cols={13}
              message="No model-backed edges currently meet the Copacetic threshold."
            />
          ) : (
            rows.map((r) => (
              <tr
                key={r.game_id + r.market + r.side}
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                  {r.sport}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.game}
                </td>
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                  {r.market}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.side}
                </td>
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                  {r.best_book}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.market_odds}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {r.model_fair_line}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {fmtPct(r.model_probability)}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {fmtPct(r.market_probability)}
                </td>
                <td
                  className="py-2.5 px-3 text-right font-semibold"
                  style={{ color: "var(--win)" }}
                >
                  {fmtEdge(r.edge)}
                </td>
                <td
                  className="py-2.5 px-3 uppercase tracking-wider"
                  style={{ color: tierStyle(r.tier) }}
                >
                  {r.tier}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: alignmentStyle(r.model_alignment) }}
                >
                  {r.model_alignment}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {fmtTime(r.updated_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function BookDiscrepanciesTable({ rows }: { rows: BookDiscrepancy[] }) {
  const hasNonModelBacked = rows.some((r) => r.model_alignment !== "Model-backed");

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono tabular border-collapse">
          <thead>
            <tr>
              <ThLabel>Sport</ThLabel>
              <ThLabel>Game</ThLabel>
              <ThLabel>Market</ThLabel>
              <ThLabel>Outcome A</ThLabel>
              <ThLabel>Book A</ThLabel>
              <ThRight>Odds A</ThRight>
              <ThLabel>Outcome B</ThLabel>
              <ThLabel>Book B</ThLabel>
              <ThRight>Odds B</ThRight>
              <ThRight>Arb Return</ThRight>
              <ThLabel>Alignment</ThLabel>
              <ThLabel>Updated</ThLabel>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyRow
                cols={12}
                message="No material book discrepancies are currently available."
              />
            ) : (
              rows.map((r) => {
                const a = r.outcomes[0];
                const b = r.outcomes[1];
                return (
                  <tr
                    key={r.game_id + r.market}
                    className="border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                      {r.sport}
                    </td>
                    <td
                      className="py-2.5 px-3 whitespace-nowrap"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {r.game}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                      {r.market}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-primary)" }}>
                      {a?.outcome ?? "—"}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                      {a?.book ?? "—"}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {a?.odds ?? "—"}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-primary)" }}>
                      {b?.outcome ?? "—"}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                      {b?.book ?? "—"}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {b?.odds ?? "—"}
                    </td>
                    <td
                      className="py-2.5 px-3 text-right font-semibold"
                      style={{ color: "#4A7CB8" }}
                    >
                      {fmtArb(r.arb_return)}
                    </td>
                    <td
                      className="py-2.5 px-3"
                      style={{ color: alignmentStyle(r.model_alignment) }}
                    >
                      {r.model_alignment}
                    </td>
                    <td
                      className="py-2.5 px-3 whitespace-nowrap"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {fmtTime(r.updated_at)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {hasNonModelBacked && rows.length > 0 && (
        <p
          className="mt-4 text-xs font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          Book discrepancies are pricing gaps between sportsbooks — not Copacetic
          model plays. Check model alignment before acting.
        </p>
      )}
    </div>
  );
}

function LineMovementTable({ rows }: { rows: LineMovement[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono tabular border-collapse">
        <thead>
          <tr>
            <ThLabel>Sport</ThLabel>
            <ThLabel>Game</ThLabel>
            <ThLabel>Market</ThLabel>
            <ThLabel>Side</ThLabel>
            <ThRight>Open</ThRight>
            <ThRight>Current</ThRight>
            <ThRight>Move</ThRight>
            <ThLabel>Direction</ThLabel>
            <ThRight>Fair Line</ThRight>
            <ThLabel>Alert</ThLabel>
            <ThLabel>Updated</ThLabel>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow
              cols={11}
              message="No notable line movements at this time."
            />
          ) : (
            rows.map((r) => (
              <tr
                key={r.game_id + r.market + r.side}
                className="border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                  {r.sport}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.game}
                </td>
                <td className="py-2.5 px-3" style={{ color: "var(--text-secondary)" }}>
                  {r.market}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.side}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {r.open_odds}
                </td>
                <td
                  className="py-2.5 px-3 text-right font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.current_odds}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {r.move}
                </td>
                <td
                  className="py-2.5 px-3"
                  style={{ color: directionStyle(r.direction) }}
                >
                  {r.direction}
                </td>
                <td
                  className="py-2.5 px-3 text-right"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {r.model_fair_line}
                </td>
                <td
                  className="py-2.5 px-3 uppercase tracking-wider"
                  style={{ color: alertStyle(r.alert) }}
                >
                  {r.alert ?? "—"}
                </td>
                <td
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {fmtTime(r.updated_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ArchivedTab({ archives }: { archives?: string[] }) {
  if (!archives || archives.length === 0) {
    return (
      <div className="py-12 text-center">
        <p
          className="text-xs font-mono"
          style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}
        >
          No archived alerts yet. Daily archive files will appear here once the
          pipeline is running.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p
        className="text-xs font-mono mb-6"
        style={{ color: "var(--text-tertiary)" }}
      >
        {archives.length} archived file{archives.length !== 1 ? "s" : ""}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono tabular border-collapse">
          <thead>
            <tr>
              <ThLabel>Date</ThLabel>
              <ThLabel>File</ThLabel>
            </tr>
          </thead>
          <tbody>
            {archives.map((filename) => {
              const match = filename.match(/^edge_alerts_(\d{4}-\d{2}-\d{2})\.json$/);
              const dateStr = match ? match[1] : filename;
              const displayDate = match
                ? new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : dateStr;
              return (
                <tr
                  key={filename}
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td
                    className="py-2.5 px-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {displayDate}
                  </td>
                  <td
                    className="py-2.5 px-3"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {filename}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Default export ────────────────────────────────────────────────────────────

export default function EdgeBoardClient({
  data,
  archives,
}: {
  data: EdgeAlertData | null;
  archives?: string[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("model_edges");
  const [sportFilter, setSportFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [alignmentFilter, setAlignmentFilter] = useState("all");
  const [dirFilter, setDirFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");

  // ── Unavailable state ──────────────────────────────────────────────────────

  if (data === null) {
    return (
      <>
        <PageHeader
          title="Copacetic Edge Board"
          subhead="Model-backed opportunities, sportsbook discrepancies, and market movement in one view."
        />
        <div
          className="py-24 flex items-center justify-center"
          style={{ minHeight: "40vh" }}
        >
          <p
            className="text-sm font-mono text-center max-w-lg"
            style={{ color: "var(--text-tertiary)" }}
          >
            Edge alerts are temporarily unavailable while the latest market data
            is processed.
          </p>
        </div>
      </>
    );
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const stale = isStale(data.as_of);

  const sportOptions = [
    { value: "all", label: "All Sports" },
    ...data.sports.map((s) => ({ value: s, label: s })),
  ];

  const tierOptions = [
    { value: "all", label: "All Tiers" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "Lean", label: "Lean" },
    { value: "Watch", label: "Watch" },
  ];

  const alignmentOptions = [
    { value: "all", label: "All Alignments" },
    { value: "Model-backed", label: "Model-backed" },
    { value: "Not model-backed", label: "Not model-backed" },
    { value: "Mixed", label: "Mixed" },
    { value: "N/A", label: "N/A" },
  ];

  const dirOptions = [
    { value: "all", label: "All Directions" },
    { value: "Toward model", label: "Toward model" },
    { value: "Away from model", label: "Away from model" },
    { value: "Neutral", label: "Neutral" },
  ];

  const alertOptions = [
    { value: "all", label: "All Alerts" },
    { value: "Steam", label: "Steam" },
    { value: "Drift", label: "Drift" },
    { value: "Stale book", label: "Stale book" },
    { value: "Watch", label: "Watch" },
  ];

  // ── Filtered rows ──────────────────────────────────────────────────────────

  const filteredModelEdges = useMemo(() => {
    return data.model_edges.filter((r) => {
      if (sportFilter !== "all" && r.sport !== sportFilter) return false;
      if (tierFilter !== "all" && r.tier !== tierFilter) return false;
      if (alignmentFilter !== "all" && r.model_alignment !== alignmentFilter)
        return false;
      return true;
    });
  }, [data.model_edges, sportFilter, tierFilter, alignmentFilter]);

  const filteredBookDiscs = useMemo(() => {
    return data.book_discrepancies.filter((r) => {
      if (sportFilter !== "all" && r.sport !== sportFilter) return false;
      if (alignmentFilter !== "all" && r.model_alignment !== alignmentFilter)
        return false;
      return true;
    });
  }, [data.book_discrepancies, sportFilter, alignmentFilter]);

  const filteredLineMoves = useMemo(() => {
    return data.line_movements.filter((r) => {
      if (sportFilter !== "all" && r.sport !== sportFilter) return false;
      if (dirFilter !== "all" && r.direction !== dirFilter) return false;
      if (alertFilter !== "all" && r.alert !== alertFilter) return false;
      return true;
    });
  }, [data.line_movements, sportFilter, dirFilter, alertFilter]);

  // ── Tab config ─────────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "model_edges", label: "Model Edges", count: data.summary.model_edges },
    {
      id: "book_discrepancies",
      label: "Book Discrepancies",
      count: data.summary.book_discrepancies,
    },
    {
      id: "line_movements",
      label: "Line Movement",
      count: data.summary.line_movements,
    },
    { id: "archived", label: "Archived Alerts" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <PageHeader
        title="Copacetic Edge Board"
        subhead="Model-backed opportunities, sportsbook discrepancies, and market movement in one view."
      />

      {/* Demo banner */}
      {data._note && (
        <div
          className="border-y px-6 py-3"
          style={{
            borderColor: "#4A7CB8",
            backgroundColor: "rgba(74,124,184,0.08)",
          }}
        >
          <p
            className="text-xs font-mono max-w-7xl mx-auto"
            style={{ color: "#4A7CB8" }}
          >
            DEMO DATA — {data._note}
          </p>
        </div>
      )}

      {/* Stale banner */}
      {stale && (
        <div
          className="border-y px-6 py-3"
          style={{
            borderColor: "var(--loss)",
            backgroundColor: "rgba(193,56,56,0.08)",
          }}
        >
          <p
            className="text-xs font-mono max-w-7xl mx-auto"
            style={{ color: "var(--loss)" }}
          >
            STATUS: STALE — Last updated {fmtTime(data.as_of)} on{" "}
            {fmtDate(data.as_of)}. Latest alert data may not reflect current
            market prices.
          </p>
        </div>
      )}

      {/* Warning banner */}
      {data.summary.warnings && data.summary.warnings.length > 0 && (
        <div
          className="border-y px-6 py-3"
          style={{
            borderColor: "#B8A040",
            backgroundColor: "rgba(184,160,64,0.08)",
          }}
        >
          <div className="max-w-7xl mx-auto space-y-1">
            {data.summary.warnings.map((w, i) => (
              <p
                key={i}
                className="text-xs font-mono"
                style={{ color: "#B8A040" }}
              >
                ⚠ {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div
        className="border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Model Edges */}
            <div
              className="px-4 py-5"
              style={{ borderLeft: "2px solid var(--border)" }}
            >
              <p
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Model Edges
              </p>
              <p
                className="font-mono text-3xl tabular"
                style={{ color: "var(--text-primary)" }}
              >
                {data.summary.model_edges}
              </p>
            </div>

            {/* Book Discrepancies */}
            <div
              className="px-4 py-5"
              style={{ borderLeft: "2px solid var(--border)" }}
            >
              <p
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Book Discrepancies
              </p>
              <p
                className="font-mono text-3xl tabular"
                style={{ color: "var(--text-primary)" }}
              >
                {data.summary.book_discrepancies}
              </p>
            </div>

            {/* Major Line Moves */}
            <div
              className="px-4 py-5"
              style={{ borderLeft: "2px solid var(--border)" }}
            >
              <p
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Major Line Moves
              </p>
              <p
                className="font-mono text-3xl tabular"
                style={{ color: "var(--text-primary)" }}
              >
                {data.summary.line_movements}
              </p>
            </div>

            {/* Last Updated */}
            <div
              className="px-4 py-5"
              style={{ borderLeft: "2px solid var(--border)" }}
            >
              <p
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Last Updated
              </p>
              <p
                className="font-mono text-sm tabular"
                style={{ color: stale ? "var(--loss)" : "var(--text-primary)" }}
              >
                {fmtTime(data.as_of)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div
        className="border-b overflow-x-auto"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-4 text-xs font-mono uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors duration-150"
                style={{
                  color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                  borderBottomColor: active ? "var(--accent)" : "transparent",
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className="px-1.5 py-0.5 text-xs font-mono"
                    style={{
                      backgroundColor: active
                        ? "var(--accent)"
                        : "var(--bg-surface-2)",
                      color: active ? "var(--text-primary)" : "var(--text-tertiary)",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div
        className="border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center">
          <Select
            label="Sport"
            value={sportFilter}
            onChange={setSportFilter}
            options={sportOptions}
          />
          {activeTab === "model_edges" && (
            <>
              <Select
                label="Tier"
                value={tierFilter}
                onChange={setTierFilter}
                options={tierOptions}
              />
              <Select
                label="Alignment"
                value={alignmentFilter}
                onChange={setAlignmentFilter}
                options={alignmentOptions}
              />
            </>
          )}
          {activeTab === "book_discrepancies" && (
            <Select
              label="Alignment"
              value={alignmentFilter}
              onChange={setAlignmentFilter}
              options={alignmentOptions}
            />
          )}
          {activeTab === "line_movements" && (
            <>
              <Select
                label="Direction"
                value={dirFilter}
                onChange={setDirFilter}
                options={dirOptions}
              />
              <Select
                label="Alert"
                value={alertFilter}
                onChange={setAlertFilter}
                options={alertOptions}
              />
            </>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "model_edges" && (
          <ModelEdgesTable rows={filteredModelEdges} />
        )}
        {activeTab === "book_discrepancies" && (
          <BookDiscrepanciesTable rows={filteredBookDiscs} />
        )}
        {activeTab === "line_movements" && (
          <LineMovementTable rows={filteredLineMoves} />
        )}
        {activeTab === "archived" && <ArchivedTab archives={archives} />}
      </div>

      {/* Disclaimer */}
      <div
        className="border-t"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p
            className="text-xs font-mono leading-relaxed max-w-3xl"
            style={{ color: "var(--text-tertiary)" }}
          >
            Copacetic Sports provides analytics and market information for
            educational purposes only. Edge alerts are based on model projections
            and available market prices at the time of update. Odds move quickly
            and may not be available when viewed. Arbitrage alerts are
            book-to-book discrepancies and are not necessarily Copacetic model
            plays.
          </p>
        </div>
      </div>
    </>
  );
}
