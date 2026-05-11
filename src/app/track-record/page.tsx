import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TrackRecordClient from "@/components/TrackRecordClient";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Record",
  description:
    "Every play is logged. Every result is verified. Full performance breakdown by edge zone, sport, and play type.",
};

export default async function TrackRecordPage() {
  const stats = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "public", "data", "stats.json"), "utf-8")
  );

  return (
    <>
      <PageHeader
        title="Track Record"
        subhead="Full public results for the MLB model, broken out by confidence and time period."
      />
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-0">
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Tier stats are shown under our current model rules. The all-time line includes the entire graded history for transparency.
        </p>
      </div>
      <TrackRecordClient
        lifetime={stats.lifetime}
        season2026={stats.season2026}
        last30Days={stats.last30Days}
        last7Days={stats.last7Days}
        bySport={stats.bySport}
        byPlayType={stats.byPlayType}
      />
    </>
  );
}
