import Link from "next/link";

interface StatCardProps {
  value: string;
  label: string;
  caption?: string;
  valueColor?: string;
}

export default function StatCard({ value, label, caption, valueColor }: StatCardProps) {
  return (
    <Link
      href="/track-record"
      className="group block p-6 border transition-colors duration-150"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="font-display text-4xl md:text-5xl tabular leading-none mb-2 transition-colors duration-150 group-hover:text-accent"
        style={{ color: valueColor ?? "var(--text-primary)" }}
      >
        {value}
      </p>
      <p
        className="text-sm font-sans uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </p>
      {caption && (
        <p
          className="text-xs mt-1 font-mono"
          style={{ color: "var(--text-tertiary)" }}
        >
          {caption}
        </p>
      )}
    </Link>
  );
}
