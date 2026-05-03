interface PageHeaderProps {
  title: string;
  subhead: string;
}

export default function PageHeader({ title, subhead }: PageHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-16">
      <h1
        className="font-display text-4xl md:text-6xl mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      <p
        className="text-base md:text-lg max-w-2xl leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {subhead}
      </p>
    </div>
  );
}
