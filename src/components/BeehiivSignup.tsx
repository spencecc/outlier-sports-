"use client";

/**
 * PHASE 3: Replace this entire component with the Beehiiv embed code.
 * Steps:
 *  1. In Beehiiv dashboard → Settings → Forms, copy the embed snippet.
 *  2. Replace the form below with:
 *     <div dangerouslySetInnerHTML={{ __html: beehiivEmbedCode }} />
 *     OR use a <Script> tag per their embed instructions.
 *  3. Remove the placeholder state and handler.
 *  4. Update the Beehiiv signup link in Footer.tsx to the real Beehiiv URL.
 */

import { useState } from "react";

export default function BeehiivSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // PHASE 3: Replace with real Beehiiv form submission
    setSubmitted(true);
  }

  return (
    <div className="w-full max-w-lg">
      {submitted ? (
        <p
          className="text-sm font-mono"
          style={{ color: "var(--text-secondary)" }}
        >
          You&apos;re on the list. Report drops before first pitch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-0">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 text-sm font-mono border outline-none focus:ring-1"
            style={{
              backgroundColor: "var(--bg-surface-2)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              caretColor: "var(--accent)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
          <button
            type="submit"
            className="px-5 py-3 text-sm font-sans uppercase tracking-wider transition-colors duration-150 shrink-0"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-dim)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent)")
            }
          >
            Subscribe
          </button>
        </form>
      )}
      <p
        className="text-xs mt-3"
        style={{ color: "var(--text-tertiary)" }}
      >
        No spam. Unsubscribe anytime. Reports go out daily during MLB season.
      </p>
    </div>
  );
}
