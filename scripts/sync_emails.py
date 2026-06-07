"""
sync_emails.py — Copies new daily_email HTML files to public/data/emails/,
updates emails.json, and pushes to GitHub so Vercel redeploys.

Schedule in Task Scheduler to run daily at 12:00 AM.
"""

import os
import re
import json
import shutil
import subprocess
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "daily_email")
DEST_DIR = os.path.join(ROOT, "public", "data", "emails")
INDEX_FILE = os.path.join(ROOT, "public", "data", "emails.json")

MONTHS = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}


def format_display_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{MONTHS[d.month]} {d.day}, {d.year}"


def extract_subject(html: str, fallback: str) -> str:
    match = re.search(r"<title>(.+?)\s*\|\s*Copacetic Sports</title>", html, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    # Try stripping just the date prefix from title if no pipe pattern
    match = re.search(r"<title>(.+?)</title>", html, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return fallback


def git_push(files_added: list[str]) -> None:
    # Pull before committing so our commit lands on top — no merge needed, no editor prompt.
    subprocess.run(["git", "pull", "--no-rebase", "origin", "main"], cwd=ROOT, check=True)
    for f in files_added:
        subprocess.run(["git", "add", f], cwd=ROOT, check=True)
    subprocess.run(["git", "add", INDEX_FILE], cwd=ROOT, check=True)
    subprocess.run(
        ["git", "commit", "-m", f"Add email archive: {', '.join(files_added)}"],
        cwd=ROOT,
        check=True,
    )
    subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=True)
    print("Pushed to GitHub - Vercel will redeploy.")


def main() -> None:
    os.makedirs(DEST_DIR, exist_ok=True)

    pattern = re.compile(r"^\d{4}-\d{2}-\d{2}\.html$")
    src_files = {f for f in os.listdir(SRC_DIR) if pattern.match(f)}
    dest_files = {f for f in os.listdir(DEST_DIR) if pattern.match(f)}

    new_files = src_files - dest_files
    if not new_files:
        print("No new emails to sync.")
        return

    with open(INDEX_FILE, "r", encoding="utf-8") as fh:
        index: list[dict] = json.load(fh)

    existing_dates = {e["date"] for e in index}
    copied = []

    for filename in sorted(new_files, reverse=True):
        date_str = filename.replace(".html", "")
        src_path = os.path.join(SRC_DIR, filename)
        dest_path = os.path.join(DEST_DIR, filename)

        shutil.copy2(src_path, dest_path)
        print(f"Copied {filename} -> public/data/emails/")
        copied.append(dest_path)

        if date_str not in existing_dates:
            with open(src_path, "r", encoding="utf-8") as fh:
                html = fh.read()
            subject = extract_subject(html, "Daily Report")
            index.append({
                "date": date_str,
                "displayDate": format_display_date(date_str),
                "title": subject,
                "file": filename,
            })

    # Keep newest first
    index.sort(key=lambda e: e["date"], reverse=True)

    with open(INDEX_FILE, "w", encoding="utf-8") as fh:
        json.dump(index, fh, indent=2)
    print(f"Updated emails.json - {len(index)} total entries.")

    git_push(copied)


if __name__ == "__main__":
    main()
