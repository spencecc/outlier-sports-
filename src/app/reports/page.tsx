import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

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
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.copaceticsports.com";

  // Fetch today's report and the index in parallel
  const [reportRes, indexRes] = await Promise.all([
    fetch(`${base}/data/reports/${today}.txt`, { cache: "no-store" }),
    fetch(`${base}/data/reports.json`, { cache: "no-store" }),
  ]);

  const report = reportRes.ok ? await reportRes.text() : null;
  const allReports: ReportEntry[] = indexRes.ok ? await indexRes.json() : [];
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

        {/* Archive */}
        {pastReports.length > 0 && (
          <div>
            <p
              className="text-xs font-mono uppercase tracking-widest mb-6"
              style={{ color: "var(--text-tertiary)" }}
            >
              Archive
            </p>
            <div className="max-w-2xl space-y-px">
              {pastReports.map((r) => (
                <Link
                  key={r.date}
                  href={`/reports/${r.date}`}
                  className="group flex items-center justify-between border p-5 transition-colors duration-150"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
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
        )}

      </div>
    </>
  );
}
