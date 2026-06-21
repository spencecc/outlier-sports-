"""
sync_reports.py — Copies today's auto_detail txt from the model output
to public/data/reports/, updates reports.json index, and pushes to GitHub.

Schedule in Task Scheduler to run daily after the morning model run (e.g. 11:00 AM).
"""

import os
import re
import sys
import json
import time
import shutil
import subprocess
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_OUTPUT = "/opt/mlb-model/output"
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

    # Reliability rules (added 2026-06-13): timeout every git call, abort a failed
    # merge instead of pushing a half-merged tree, and treat "nothing to commit" as a
    # clean no-op rather than a crash.
    def git(*args, allow_fail=False):
        r = subprocess.run(["git", *args], cwd=ROOT,
                           capture_output=True, text=True, timeout=120)
        if r.returncode != 0 and not allow_fail:
            raise RuntimeError(f"git {' '.join(args)} failed:\n{(r.stderr or r.stdout).strip()}")
        return r

    def commit_and_push(git, paths, message, *, max_attempts=5):
        """Commit `paths` and push to origin/main, self-healing against concurrent
        pushes from the other cron jobs that target this same repo (export / reports /
        edge alerts). Returns True if a commit was pushed, False if there was nothing
        to commit. Raises (loudly, for the caller to exit non-zero) on real failure.
        """
        git("add", *paths)
        commit = git("commit", "-m", message, allow_fail=True)
        if commit.returncode != 0:
            if "nothing to commit" in commit.stdout + commit.stderr:
                return False
            raise RuntimeError(f"git commit failed:\n{(commit.stderr or commit.stdout).strip()}")

        last_err = ""
        for attempt in range(1, max_attempts + 1):
            # Replay our commit on top of the latest remote. The cron jobs touch
            # different files, so this is normally clean; on a real conflict, abort
            # the rebase so the tree is left clean for the next run, and bail.
            rebase = git("pull", "--rebase", "origin", "main", allow_fail=True)
            if rebase.returncode != 0:
                git("rebase", "--abort", allow_fail=True)
                raise RuntimeError(
                    "git pull --rebase failed (rebase aborted, repo left clean):\n"
                    f"{(rebase.stderr or rebase.stdout).strip()}")
            push = git("push", "origin", "main", allow_fail=True)
            if push.returncode == 0:
                return True
            # Rejected because a concurrent push moved the ref
            # ("cannot lock ref" / "fetch first" / "non-fast-forward").
            # Back off and retry from the rebase.
            last_err = (push.stderr or push.stdout).strip()
            time.sleep(2 * attempt)
        raise RuntimeError(f"git push failed after {max_attempts} attempts:\n{last_err}")

    try:
        pushed = commit_and_push(git, [dest, INDEX_FILE], f"Add daily report: {today}")
        print(f"Pushed report for {today} - Vercel will redeploy." if pushed
              else f"Report for {today} already committed — nothing to push.")
    except subprocess.TimeoutExpired as e:
        print(f"ERROR: git timed out after {e.timeout}s on: {e.cmd}", file=sys.stderr)
        sys.exit(1)
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
