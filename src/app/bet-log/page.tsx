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
  const bets: Bet[] = JSON.parse(
    await fs.readFile(path.join(process.cwd(), "public", "data", "bets.json"), "utf-8")
  );

  return <BetLogClient bets={bets} />;
}
