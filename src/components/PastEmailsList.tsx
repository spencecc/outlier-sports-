"use client";

import Link from "next/link";

interface EmailEntry {
  date: string;
  title: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PastEmailsList({ emails }: { emails: EmailEntry[] }) {
  if (emails.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        No past emails yet — check back tomorrow.
      </p>
    );
  }

  return (
    <div className="space-y-px">
      {emails.map((email) => (
        <Link
          key={email.date}
          href={`/past-emails/${email.date}`}
          className="group flex items-center justify-between border p-5 transition-colors duration-150"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-surface)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <div>
            <p
              className="text-xs font-mono mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              {formatDate(email.date)}
            </p>
            <p
              className="font-display text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              {email.title}
            </p>
          </div>
          <span
            className="text-xs font-mono shrink-0 ml-4 transition-colors duration-150 group-hover:text-accent"
            style={{ color: "var(--text-tertiary)" }}
          >
            Read →
          </span>
        </Link>
      ))}
    </div>
  );
}
