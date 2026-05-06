import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ReportsArchiveList from "@/components/ReportsArchiveList";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Full daily model output — pitcher stats, bullpen status, weather, park factors, and simulation results for every game evaluated.",
};

interface ReportEntry {
  date: string;
  displayDate: string;
  file: string;
  games: number | null;
  plays: number | null;
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function ReportsPage() {
  const today = todayDate();
  const dataDir = path.join(process.cwd(), "public", "data");

  let report: string | null = null;
  try {
    report = await fs.readFile(path.join(dataDir, "reports", `${today}.txt`), "utf-8");
  } catch {
    // not available yet
  }

  let allReports: ReportEntry[] = [];
  try {
    allReports = JSON.parse(await fs.readFile(path.join(dataDir, "reports.json"), "utf-8"));
  } catch {
    // index missing
  }
  const pastReports = allReports.filter((r) => r.date < today);

  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Full model output — pitchers, bullpen, weather, park factors."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Today's report */}
        <div>
          <p
            className="text-xs font-mono uppercase tracking-widest mb-6"
            style={{ color: "var(--text-tertiary)" }}
          >
            Today — {today}
          </p>

          {report ? (
            <div
              className="border p-6 md:p-8 overflow-x-auto"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
            >
              <pre
                className="text-xs leading-relaxed whitespace-pre font-mono"
                style={{ color: "var(--text-secondary)" }}
              >
                {report}
              </pre>
            </div>
          ) : (
            <div
              className="border p-8"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="font-display text-2xl mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                No report yet today.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Today&apos;s full model output will appear here once the morning
                run completes.
              </p>
            </div>
          )}
        </div>

        <ReportsArchiveList reports={pastReports} />

      </div>
    </>
  );
}
