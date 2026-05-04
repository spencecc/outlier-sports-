import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TrackRecordClient from "@/components/TrackRecordClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Track Record",
  description:
    "Every play is logged. Every result is verified. Full performance breakdown by edge zone, sport, and play type.",
};

export default async function TrackRecordPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://outliersportshq.com"}/data/stats.json`,
    { cache: "no-store" }
  );
  const stats = await res.json();

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
        higherModelConf={stats.higherModelConf}
      />
    </>
  );
}
