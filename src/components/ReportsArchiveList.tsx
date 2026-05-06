"use client";

import Link from "next/link";

interface ReportEntry {
  date: string;
  displayDate: string;
  file: string;
  games: number | null;
  plays: number | null;
}

export default function ReportsArchiveList({ reports }: { reports: ReportEntry[] }) {
  if (reports.length === 0) return null;

  return (
    <div>
      <p
        className="text-xs font-mono uppercase tracking-widest mb-6"
        style={{ color: "var(--text-tertiary)" }}
      >
        Archive
      </p>
      <div className="max-w-2xl space-y-px">
        {reports.map((r) => (
          <Link
            key={r.date}
            href={`/reports/${r.date}`}
            className="group flex items-center justify-between border p-5 transition-colors duration-150"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div>
              <p
                className="text-xs font-mono mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                {r.displayDate}
              </p>
              <p
                className="font-display text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {r.games ?? "—"} games evaluated &middot; {r.plays ?? "—"} plays
              </p>
            </div>
            <span
              className="text-xs font-mono shrink-0 ml-4 transition-colors duration-150 group-hover:text-accent"
              style={{ color: "var(--text-tertiary)" }}
            >
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
