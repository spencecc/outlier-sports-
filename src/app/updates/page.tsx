import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import updates from "../../../public/data/updates.json";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Notes from Copacetic Sports on the model, the process, and what's coming next.",
};

export default function UpdatesPage() {
  return (
    <>
      <PageHeader
        title="Updates"
        subhead="Notes on the model, the process, and what's coming next."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl space-y-16">
          {updates.map((update) => {
            const displayDate = new Date(update.date + "T12:00:00").toLocaleDateString(
              "en-US",
              { month: "long", day: "numeric", year: "numeric" }
            );

            return (
              <article key={update.id}>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {displayDate}
                </p>
                <h2
                  className="font-display text-2xl md:text-3xl mb-5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {update.title}
                </h2>
                <div
                  className="text-sm leading-relaxed space-y-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {update.body.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
