import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  return { title: `Report ${date} — Copacetic Sports` };
}

export default async function ReportDetailPage({ params }: Props) {
  const { date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  let report: string;
  try {
    report = await fs.readFile(
      path.join(process.cwd(), "public", "data", "reports", `${date}.txt`),
      "utf-8"
    );
  } catch {
    notFound();
  }

  return (
    <div>
      <div
        className="border-b px-6 py-3"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}
      >
        <Link
          href="/reports"
          className="text-xs font-mono transition-colors duration-150"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          &larr; Reports
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <p
          className="text-xs font-mono uppercase tracking-widest mb-6"
          style={{ color: "var(--text-tertiary)" }}
        >
          {date}
        </p>
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
      </div>
    </div>
  );
}
