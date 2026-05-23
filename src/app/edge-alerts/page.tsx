import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import EdgeBoardClient from "./EdgeBoardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edge Board",
  description:
    "Model-backed opportunities, sportsbook discrepancies, and market movement alerts powered by Copacetic projections.",
};

export default async function EdgeAlertsPage() {
  const publishDir = path.join(process.cwd(), "public", "data", "publish");

  let alertData = null;
  try {
    const raw = await fs.readFile(
      path.join(publishDir, "edge_alerts_latest.json"),
      "utf-8"
    );
    alertData = JSON.parse(raw);
  } catch {}

  let archives: string[] = [];
  try {
    const files = await fs.readdir(publishDir);
    archives = files
      .filter((f) => /^edge_alerts_\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .reverse();
  } catch {}

  return <EdgeBoardClient data={alertData} archives={archives} />;
}
