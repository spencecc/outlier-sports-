import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";
import PastEmailsList from "@/components/PastEmailsList";
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
          <PastEmailsList emails={emails} />
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
            The archive is yesterday&apos;s email. Subscribers get today&apos;s — a full
            breakdown of every game plus all High Confidence signals — delivered every
            morning before games start.
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
