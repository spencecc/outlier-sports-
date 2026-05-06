import { notFound } from "next/navigation";
import Link from "next/link";
import EmailFrame from "@/components/EmailFrame";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  return {
    title: `${date} — Copacetic Sports`,
  };
}

export default async function PastEmailPage({ params }: Props) {
  const { date } = await params;

  // Validate date format to prevent path traversal
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const today = new Date().toISOString().slice(0, 10);
  if (date >= today) notFound();

  try {
    await fs.access(path.join(process.cwd(), "public", "data", "emails", `${date}.html`));
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Thin back nav */}
      <div
        className="border-b px-6 py-3"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <Link
          href="/past-emails"
          className="text-xs font-mono transition-colors duration-150"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-tertiary)")
          }
        >
          ← Past Emails
        </Link>
      </div>

      <EmailFrame src={`/data/emails/${date}.html`} />
    </div>
  );
}
