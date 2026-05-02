interface ReportCardProps {
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

export default function ReportCard({ title, date, excerpt, url }: ReportCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-6 border transition-colors duration-150"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-xs font-mono mb-2 tabular"
        style={{ color: "var(--text-tertiary)" }}
      >
        {date}
      </p>
      <p
        className="font-sans text-base font-medium mb-2 transition-colors duration-150 group-hover:text-accent"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {excerpt}
      </p>
      <span
        className="text-xs font-sans uppercase tracking-wider transition-colors duration-150 group-hover:text-accent"
        style={{ color: "var(--text-secondary)" }}
      >
        Read →
      </span>
    </a>
  );
}
