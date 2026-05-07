"use client";

import Link from "next/link";

interface ReportEntry {
  date: string;
  displayDate: string;
  file: string;
  games: number | null;
  plays: number | null;
}

export default function ReportsArchiveList({
  reports,
  todayDate,
}: {
  reports: ReportEntry[];
  todayDate?: string;
}) {
  if (reports.length === 0) return null;

  return (
    <div className="max-w-2xl space-y-px">
      {reports.map((r) => {
        const isToday = r.date === todayDate;
        return (
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
                style={{ color: isToday ? "var(--accent)" : "var(--text-tertiary)" }}
              >
                {isToday ? "Today" : r.displayDate}
              </p>
              <p
                className="font-display text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {isToday ? r.displayDate : (r.games ?? "—") + " games · " + (r.plays ?? "—") + " plays"}
              </p>
              {isToday && (
                <p className="text-xs font-mono mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {r.games ?? "—"} games evaluated &middot; {r.plays ?? "—"} plays
                </p>
              )}
            </div>
            <span
              className="text-xs font-mono shrink-0 ml-4"
              style={{ color: "var(--text-tertiary)" }}
            >
              View →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
