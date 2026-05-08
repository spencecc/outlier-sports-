"""
archive_email.py
================
Runs at midnight. Copies today's daily email HTML into the Past Emails
archive (public/data/emails/) and updates emails.json, then pushes to
GitHub so Vercel rebuilds the site.

Schedule via Windows Task Scheduler to run daily at 00:01.
"""

import json
import os
import re
import shutil
import subprocess
from datetime import date, timedelta
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────
REPO        = Path(r"C:\Users\spenc\OneDrive\Desktop\OutlierSports\outlier-sports")
DAILY_DIR   = REPO / "daily_email"
EMAILS_DIR  = REPO / "public" / "data" / "emails"
INDEX_FILE  = REPO / "public" / "data" / "emails.json"

# ── Helpers ─────────────────────────────────────────────────────────────────

def extract_title(html: str) -> str:
    """Pull the title from the <title> tag, strip ' | Copacetic Sports' suffix."""
    m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    if not m:
        return ""
    title = m.group(1).strip()
    title = re.sub(r"\s*\|\s*Copacetic Sports\s*$", "", title, flags=re.IGNORECASE)
    return title.strip()


def fmt_display_date(d: date) -> str:
    return d.strftime("%B %-d, %Y") if os.name != "nt" else d.strftime("%B %d, %Y").replace(" 0", " ")


def load_index() -> list:
    if INDEX_FILE.exists():
        return json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    return []


def save_index(entries: list) -> None:
    INDEX_FILE.write_text(json.dumps(entries, indent=2, ensure_ascii=False), encoding="utf-8")


def git(*args):
    result = subprocess.run(["git", "-C", str(REPO)] + list(args),
                            capture_output=True, text=True)
    return result


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    today = date.today()                     # the date we're archiving
    date_str = today.strftime("%Y-%m-%d")

    src = DAILY_DIR / f"{date_str}.html"
    dst = EMAILS_DIR / f"{date_str}.html"

    print(f"[archive_email] Archiving {date_str}...")

    if not src.exists():
        print(f"  No email file found at {src} — nothing to do.")
        return

    # Copy HTML into archive
    EMAILS_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  Copied to {dst}")

    # Extract title
    html = src.read_text(encoding="utf-8")
    title = extract_title(html) or f"Daily Report — {fmt_display_date(today)}"
    print(f"  Title: {title}")

    # Update emails.json — prepend if not already present
    entries = load_index()
    if not any(e["date"] == date_str for e in entries):
        entries.insert(0, {
            "date":        date_str,
            "displayDate": fmt_display_date(today),
            "title":       title,
            "file":        f"{date_str}.html",
        })
        save_index(entries)
        print(f"  emails.json updated ({len(entries)} entries)")
    else:
        print(f"  {date_str} already in emails.json — skipping index update")

    # Git commit and push
    git("add",
        f"public/data/emails/{date_str}.html",
        "public/data/emails.json")

    commit = git("commit", "-m", f"Archive email {date_str}: {title}")
    if commit.returncode != 0:
        if "nothing to commit" in commit.stdout + commit.stderr:
            print("  Nothing new to commit.")
            return
        print(f"  Git commit error: {commit.stderr.strip()}")
        return

    push = git("push")
    if push.returncode != 0:
        print(f"  Git push error: {push.stderr.strip()}")
        return

    print(f"  Done. Vercel will rebuild in ~30 seconds.")


if __name__ == "__main__":
    main()
