"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/plays", label: "Today's Plays" },
  { href: "/track-record", label: "Track Record" },
  { href: "/bet-log", label: "Bet Log" },
  { href: "/methodology", label: "Methodology" },
  { href: "/reports", label: "Reports" },
  { href: "/support", label: "Support" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-xl tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Outlier Sports
          <span
            className="inline-block w-1 h-1 rounded-full ml-0.5 mb-0.5 align-bottom"
            style={{ backgroundColor: "var(--accent)" }}
            aria-hidden
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{ color: "var(--text-secondary)" }}
        >
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "currentColor",
              transform: open ? "translateY(5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "currentColor",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "currentColor",
              transform: open ? "translateY(-5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
