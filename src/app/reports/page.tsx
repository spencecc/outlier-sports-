import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Full daily model output — pitcher stats, bullpen status, weather, park factors, and simulation results for every game evaluated.",
};

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function ReportsPage() {
  const date = todayDate();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.copaceticsports.com";

  let report: string | null = null;
  try {
    const res = await fetch(`${base}/data/reports/${date}.txt`, {
      cache: "no-store",
    });
    if (res.ok) report = await res.text();
  } catch {
    // file not available yet
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Full model output — pitchers, bullpen, weather, park factors."
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {report ? (
          <div
            className="border p-6 md:p-8 overflow-x-auto"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <p
              className="text-xs font-mono mb-6 uppercase tracking-widest"
              style={{ color: "var(--text-tertiary)" }}
            >
              {date}
            </p>
            <pre
              className="text-xs leading-relaxed whitespace-pre font-mono"
              style={{ color: "var(--text-secondary)" }}
            >
              {report}
            </pre>
          </div>
        ) : (
          <div
            className="border p-8 max-w-2xl"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-display text-2xl md:text-3xl mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              No report yet today.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Today&apos;s full model output will appear here once the morning run
              completes. Check back after first pitch.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
