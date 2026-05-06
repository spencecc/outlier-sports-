import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

interface Pick {
  date: string;
  sport: string;
  game: string;
  play: string;
  type: string;
  edge: number;
  odds: number;
  isLean: boolean;
}

export const metadata: Metadata = {
  title: "Today's Plays",
  description:
    "Today's model-generated plays from Copacetic Sports. Standard Edge picks published free. High Confidence plays delivered to email subscribers only.",
};

function fmtOdds(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default async function PlaysPage() {
  const picks = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "public", "data", "picks.json"), "utf-8")
  ) as { date: string; picks: Pick[]; hasPicks: boolean };
  const { date, picks: playList, hasPicks } = picks;

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PageHeader
        title="Today's Plays"
        subhead={displayDate}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">

        {/* Plays list */}
        <div className="max-w-2xl">
          {!hasPicks ? (
            <div
              className="border py-12 px-8 text-center"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="font-display text-2xl mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                No play today.
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                The model didn&apos;t find enough edge to release a play. PASS
                days are part of the process — we only send plays when the edge
                is real.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {playList.map((pick, i) => (
                <div
                  key={i}
                  className="border p-6"
                  style={{
                    borderColor: pick.isLean ? "var(--border)" : "var(--accent)",
                    borderLeftWidth: pick.isLean ? "1px" : "3px",
                  }}
                >
                  {pick.isLean && (
                    <p
                      className="text-xs font-sans uppercase tracking-widest mb-3"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Lean — no Standard Edge play today
                    </p>
                  )}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p
                        className="text-xs font-mono mb-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {pick.sport} · {pick.game} · {pick.type}
                      </p>
                      <p
                        className="font-display text-xl md:text-2xl"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {pick.play}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="font-mono text-2xl tabular"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {fmtOdds(pick.odds)}
                      </p>
                      <p
                        className="text-xs font-mono mt-1"
                        style={{ color: "var(--accent)" }}
                      >
                        {pick.edge.toFixed(1)}% edge
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HC upsell */}
        <div
          className="border-t pt-12 max-w-2xl"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="font-display text-2xl md:text-3xl mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            High Confidence plays go to subscribers first.
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            When the model finds a high-conviction edge, that play goes to the
            email list before it goes anywhere else. Free to subscribe.
          </p>
          <BeehiivSignup />
        </div>

      </div>
    </>
  );
}
