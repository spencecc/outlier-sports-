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

  let todayEntry: ReportEntry | null = null;
  try {
    const raw = await fs.readFile(path.join(dataDir, "reports", `${today}.txt`), "utf-8");
    const metaLine = raw.split("\n").find((l) => l.startsWith("Games:")) ?? "";
    const gamesMatch = metaLine.match(/Games:\s*(\d+)/);
    const playsMatch = metaLine.match(/Plays:\s*(\d+)/);
    todayEntry = {
      date: today,
      displayDate: new Date(today + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      file: `${today}.txt`,
      games: gamesMatch ? parseInt(gamesMatch[1]) : null,
      plays: playsMatch ? parseInt(playsMatch[1]) : null,
    };
  } catch {
    // not available yet
  }

  let allReports: ReportEntry[] = [];
  try {
    allReports = JSON.parse(await fs.readFile(path.join(dataDir, "reports.json"), "utf-8"));
  } catch {
    // index missing
  }

  const pastReports = allReports.filter((r) => r.date !== today);
  const reportList = todayEntry ? [todayEntry, ...pastReports] : pastReports;

  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Full model output — pitchers, bullpen, weather, park factors."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {reportList.length === 0 ? (
          <div
            className="border p-8 max-w-2xl"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-display text-2xl mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              No reports yet today.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Today&apos;s full model output will appear here once the morning
              run completes.
            </p>
          </div>
        ) : (
          <ReportsArchiveList reports={reportList} todayDate={today} />
        )}
      </div>
    </>
  );
}
