interface StatsRow {
  label: string;
  bets: number;
  record: string;
  winPct: number;
  roi: number;
  units: number;
}

interface StatsTableProps {
  rows: StatsRow[];
}

function signed(n: number, suffix: string) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}${suffix}`;
}

export default function StatsTable({ rows }: StatsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-mono tabular border-collapse">
        <thead>
          <tr
            className="border-b text-xs uppercase tracking-wider"
            style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}
          >
            <th className="text-left py-3 pr-6 font-normal">Segment</th>
            <th className="text-right py-3 px-4 font-normal">Bets</th>
            <th className="text-right py-3 px-4 font-normal">Record</th>
            <th className="text-right py-3 px-4 font-normal">Win %</th>
            <th className="text-right py-3 px-4 font-normal">ROI</th>
            <th className="text-right py-3 pl-4 font-normal">Units</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <td
                className="py-3 pr-6 font-sans text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {row.label}
              </td>
              <td
                className="text-right py-3 px-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {row.bets}
              </td>
              <td
                className="text-right py-3 px-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {row.record}
              </td>
              <td
                className="text-right py-3 px-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {row.winPct.toFixed(1)}%
              </td>
              <td
                className="text-right py-3 px-4"
                style={{ color: row.roi >= 0 ? "var(--win)" : "var(--loss)" }}
              >
                {signed(row.roi, "%")}
              </td>
              <td
                className="text-right py-3 pl-4"
                style={{ color: row.units >= 0 ? "var(--win)" : "var(--loss)" }}
              >
                {signed(row.units, "u")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
