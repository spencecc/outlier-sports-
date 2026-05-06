"""
sync_reports.py — Copies today's auto_detail txt from the model output
to public/data/reports/ and pushes to GitHub so Vercel redeploys.

Schedule in Task Scheduler to run daily after the morning model run (e.g. 11:00 AM).
"""

import os
import shutil
import subprocess
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_OUTPUT = r"C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\output"
DEST_DIR = os.path.join(ROOT, "public", "data", "reports")


def main() -> None:
    os.makedirs(DEST_DIR, exist_ok=True)

    today = date.today().strftime("%Y-%m-%d")
    src = os.path.join(MODEL_OUTPUT, f"auto_detail_{today}.txt")
    dest = os.path.join(DEST_DIR, f"{today}.txt")

    if not os.path.exists(src):
        print(f"No detail file found for {today} — model may not have run yet.")
        return

    if os.path.exists(dest):
        src_size = os.path.getsize(src)
        dest_size = os.path.getsize(dest)
        if src_size == dest_size:
            print(f"Report for {today} already synced and unchanged.")
            return

    shutil.copy2(src, dest)
    print(f"Copied auto_detail_{today}.txt -> public/data/reports/")

    subprocess.run(["git", "add", dest], cwd=ROOT, check=True)
    subprocess.run(
        ["git", "commit", "-m", f"Add daily report: {today}"],
        cwd=ROOT,
        check=True,
    )
    subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=True)
    print(f"Pushed report for {today} - Vercel will redeploy.")


if __name__ == "__main__":
    main()
