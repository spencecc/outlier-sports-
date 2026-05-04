import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Support Outlier Sports",
  description:
    "Support Outlier Sports. The model, the picks, and the track record are free — tips are appreciated but never expected.",
};

export default function SupportPage() {
  return (
    <>
      <PageHeader
        title="Support Outlier Sports"
        subhead="The picks are free. Tips are appreciated but never expected."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-xl">
          <p
            className="text-base leading-relaxed mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Outlier Sports is free — the daily reports, the track record, the
            bet log, all of it. If the model has been useful to you and you want
            to throw a few bucks toward keeping it running, here&apos;s how.
          </p>

          <div
            className="border p-8 mb-10"
            style={{ borderColor: "var(--accent)" }}
          >
            <p
              className="text-xs font-sans uppercase tracking-widest mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              Venmo
            </p>
            <p
              className="font-display text-3xl md:text-4xl mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              @spencecc23
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Any amount is appreciated. No pressure, no recurring charges.
            </p>
          </div>

          <div
            className="border-t pt-8 space-y-4"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              The best support is telling someone about the model. If you know
              someone who takes sports betting seriously, send them to{" "}
              <span style={{ color: "var(--text-primary)" }}>
                outliersportshq.com
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
