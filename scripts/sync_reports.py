"""
sync_reports.py — Copies today's auto_detail txt from the model output
to public/data/reports/, updates reports.json index, and pushes to GitHub.

Schedule in Task Scheduler to run daily after the morning model run (e.g. 11:00 AM).
"""

import os
import re
import json
import shutil
import subprocess
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_OUTPUT = r"C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\output"
DEST_DIR = os.path.join(ROOT, "public", "data", "reports")
INDEX_FILE = os.path.join(ROOT, "public", "data", "reports.json")

MONTHS = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}


def format_display_date(date_str: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{MONTHS[d.month]} {d.day}, {d.year}"


def parse_header(filepath: str) -> tuple[int | None, int | None]:
    with open(filepath, encoding="utf-8") as fh:
        fh.readline()
        second = fh.readline().strip()
    games_match = re.search(r"Games:\s*(\d+)", second)
    plays_match = re.search(r"Plays:\s*(\d+)", second)
    return (
        int(games_match.group(1)) if games_match else None,
        int(plays_match.group(1)) if plays_match else None,
    )


def update_index(date_str: str, filename: str, dest_path: str) -> None:
    if os.path.exists(INDEX_FILE):
        with open(INDEX_FILE, encoding="utf-8") as fh:
            index: list[dict] = json.load(fh)
    else:
        index = []

    existing_dates = {e["date"] for e in index}
    if date_str not in existing_dates:
        games, plays = parse_header(dest_path)
        index.append({
            "date": date_str,
            "displayDate": format_display_date(date_str),
            "file": filename,
            "games": games,
            "plays": plays,
        })
        index.sort(key=lambda e: e["date"], reverse=True)
        with open(INDEX_FILE, "w", encoding="utf-8") as fh:
            json.dump(index, fh, indent=2)
        print(f"Updated reports.json - {len(index)} total entries.")


def main() -> None:
    os.makedirs(DEST_DIR, exist_ok=True)

    today = date.today().strftime("%Y-%m-%d")
    src = os.path.join(MODEL_OUTPUT, f"auto_detail_{today}.txt")
    filename = f"{today}.txt"
    dest = os.path.join(DEST_DIR, filename)

    if not os.path.exists(src):
        print(f"No detail file found for {today} - model may not have run yet.")
        return

    if os.path.exists(dest) and os.path.getsize(src) == os.path.getsize(dest):
        print(f"Report for {today} already synced and unchanged.")
        return

    shutil.copy2(src, dest)
    print(f"Copied auto_detail_{today}.txt -> public/data/reports/")

    update_index(today, filename, dest)

    subprocess.run(["git", "add", dest, INDEX_FILE], cwd=ROOT, check=True)
    subprocess.run(
        ["git", "commit", "-m", f"Add daily report: {today}"],
        cwd=ROOT,
        check=True,
    )
    subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=True)
    print(f"Pushed report for {today} - Vercel will redeploy.")


if __name__ == "__main__":
    main()
