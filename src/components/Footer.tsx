import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p
            className="font-display text-lg mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Outlier Sports
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            10,000 Simulations. Find the Outliers.
          </p>
          <p
            className="text-xs mt-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            © {new Date().getFullYear()} Outlier Sports. All rights reserved.
          </p>
        </div>

        {/* Read */}
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-4 font-sans"
            style={{ color: "var(--text-tertiary)" }}
          >
            Read
          </p>
          <ul className="flex flex-col gap-3">
            {[
              { href: "/track-record", label: "Track Record" },
              { href: "/bet-log", label: "Bet Log" },
              { href: "/methodology", label: "Methodology" },
              { href: "/reports", label: "Reports" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm transition-colors duration-150 hover:text-primary"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p
            className="text-xs uppercase tracking-widest mb-4 font-sans"
            style={{ color: "var(--text-tertiary)" }}
          >
            Connect
          </p>
          <ul className="flex flex-col gap-3">
            <li>
              <a
                href="https://x.com/OutlierSportsHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors duration-150"
                style={{ color: "var(--text-secondary)" }}
              >
                X @OutlierSportsHQ
              </a>
            </li>
            <li>
              {/* Beehiiv signup link — update with real URL in Phase 3 */}
              <a
                href="#signup"
                className="text-sm transition-colors duration-150"
                style={{ color: "var(--text-secondary)" }}
              >
                Free Daily Report
              </a>
            </li>
            <li>
              <Link
                href="/support"
                className="text-sm transition-colors duration-150"
                style={{ color: "var(--text-secondary)" }}
              >
                Support Outlier
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer strip */}
      <div
        className="border-t px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <p
          className="text-xs text-center max-w-3xl mx-auto leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          Outlier Sports is for entertainment and informational purposes only.
          21+ where applicable. Bet responsibly.{" "}
          <Link
            href="/legal/disclaimer"
            className="underline underline-offset-2 transition-colors duration-150"
            style={{ color: "var(--text-tertiary)" }}
          >
            Disclaimer
          </Link>
        </p>
      </div>
    </footer>
  );
}
