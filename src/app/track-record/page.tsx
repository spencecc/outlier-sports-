import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TrackRecordClient from "@/components/TrackRecordClient";
import stats from "../../../public/data/stats.json";

export const metadata: Metadata = {
  title: "Track Record",
  description:
    "Every play is logged. Every result is verified. Full performance breakdown by edge zone, sport, and play type.",
};

export default function TrackRecordPage() {
  return (
    <>
      <PageHeader
        title="Track Record"
        subhead="Every play is logged. Every result is verified. Updated daily."
      />
      <TrackRecordClient
        lifetime={stats.lifetime}
        season2026={stats.season2026}
        last30Days={stats.last30Days}
        last7Days={stats.last7Days}
        byEdgeZone={stats.byEdgeZone}
        bySport={stats.bySport}
        byPlayType={stats.byPlayType}
        byTier={stats.byTier}
      />
    </>
  );
}
