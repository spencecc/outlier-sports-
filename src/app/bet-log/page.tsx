import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import BetLogClient, { type Bet } from "./BetLogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bet Log",
  description:
    "Every play released, in order. Sortable, filterable, fully verified results with CLV.",
};

export default async function BetLogPage() {
  const dataDir = path.join(process.cwd(), "public", "data");

  const bets: Bet[] = JSON.parse(
    await fs.readFile(path.join(dataDir, "bets.json"), "utf-8")
  );

  // bets.json and stats.json are written together by export_web_data.py,
  // so stats.lastUpdated is the authoritative "data last refreshed" stamp.
  let lastUpdated: string | null = null;
  try {
    const stats = JSON.parse(
      await fs.readFile(path.join(dataDir, "stats.json"), "utf-8")
    );
    lastUpdated = stats.lastUpdated ?? null;
  } catch {}

  return <BetLogClient bets={bets} lastUpdated={lastUpdated} />;
}
