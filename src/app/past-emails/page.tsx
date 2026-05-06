import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Past Emails",
  description:
    "Archive of daily Copacetic Sports emails — every play, every result, every breakdown. Subscribe to get today's in your inbox.",
};

interface EmailEntry {
  date: string;
  title: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PastEmailsPage() {
  const allEmails = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "public", "data", "emails.json"), "utf-8")
  ) as EmailEntry[];

  const today = new Date().toISOString().slice(0, 10);
  const emails = allEmails.filter((e) => e.date < today);

  return (
    <>
      <PageHeader
        title="Past Emails"
        subhead="Yesterday's email, published the next morning."
      />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Email list */}
        <div className="max-w-2xl">
          {emails.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No past emails yet — check back tomorrow.
            </p>
          ) : (
            <div className="space-y-px">
              {emails.map((email) => (
                <Link
                  key={email.date}
                  href={`/past-emails/${email.date}`}
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
                      {formatDate(email.date)}
                    </p>
                    <p
                      className="font-display text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {email.title}
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono shrink-0 ml-4 transition-colors duration-150 group-hover:text-accent"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Signup CTA */}
        <div
          className="border-t pt-12 max-w-2xl"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="font-display text-2xl md:text-3xl mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Get today&apos;s before first pitch.
          </p>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
            The archive is yesterday&apos;s email. Subscribers get today&apos;s — including
            all Higher Model Confidence signals — delivered every morning before games start.
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Free. No spam. Unsubscribe any time.
          </p>
          <BeehiivSignup />
        </div>

      </div>
    </>
  );
}
