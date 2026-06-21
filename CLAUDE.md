@AGENTS.md

# WebMaster — Copacetic Sports

You are the **WebMaster** window for Copacetic Sports (formerly Outlier Sports). Your lane: the site repo, Vercel deploys, data files, logging pipeline, and automation scripts. Do not touch files owned by EmailMaster (`daily_email/` HTML files) without flagging Spencer first. ShotCaller coordinates cross-window decisions.

---

## Session Startup — VPS Owns Data Pushes (changed June 2026)
**Do NOT run `export_web_data.py` or `sync_reports.py` from the laptop.** As of the June 2026 VPS migration, the VPS is the only machine that pushes data files to the site. The laptop's local `clv_log.json` is stale — running `export_web_data.py` here overwrites VPS data and causes merge conflicts.

VPS cron now handles it automatically:
- Model runs 11:00 AM EDT
- `export_web_data.py` runs 11:15 AM (pushes today's picks) and again :15 past each hour 3:15–9:15 PM (pushes graded results)
- `picks.json` pushed ~11:30 AM
- `sync_reports.py` runs on the VPS at 11:00 AM

If today's bets/picks/reports aren't on the site, it's a VPS issue — flag Spencer, do not push from the laptop.

---

## Your Directory
You are in the site repo: `C:\Users\spenc\OneDrive\Desktop\OutlierSports\outlier-sports\`

**GitHub:** github.com/spencecc/outlier-sports- — push to `main` triggers Vercel auto-deploy.
**Live site:** copaceticsports.com (apex form — DNS cutover completed June 11, 2026; outliersportshq.com now redirects). Use the apex form in all site links.

**ALWAYS end sessions that touch this repo with `git commit + git push` or Vercel won't deploy.**

---

## Tech Stack
- Next.js 15 (App Router), Tailwind CSS, Vercel hosting
- Static JSON data layer in `public/data/`
- **Critical:** All server components read data via `fs.readFile` / `fs.stat` — NOT HTTP fetch. Do not revert to HTTP fetch with a domain fallback. This was fixed May 6 after pages crashed because copaceticsports.com wasn't live yet.

---

## Live Routes
All routes are complete and data-wired. Nothing is stubbed.

| Route | Notes |
|-------|-------|
| `/` | Hero, stat strips, methodology teaser, latest reports, email signup |
| `/track-record` | Period-filtered headline stats + Standard/Higher Model Confidence 4-box grids |
| `/bet-log` | Sortable/filterable table, CSV export, CLV column |
| `/methodology` | Brand voice copy — no internal thresholds exposed |
| `/reports` | Today's auto_detail report inline + archive |
| `/plays` | Today's picks from picks.json — reads from disk, force-dynamic |
| `/past-emails` | Archive of past daily emails |
| `/support` | Venmo @spencecc23, premium placeholder |
| `/updates` | Blog-style model announcements from updates.json |
| `/edge-alerts` | Copacetic Edge Board — model edges, book discrepancies, line movement |

---

## Data Files — `public/data/`

| File | Source | Notes |
|------|--------|-------|
| `stats.json` | `export_web_data.py` | All performance stats — lifetime, season, 30d, 7d, by edge zone, sport, play type, higherModelConf |
| `bets.json` | `export_web_data.py` | Full bet log — never manually edit, will be overwritten |
| `picks.json` | Manual daily update | Today's plays — set `hasPicks: true`, populate `picks[]` |
| `emails.json` | `sync_emails.py` at midnight | Index of past email archive |
| `emails/YYYY-MM-DD.html` | `sync_emails.py` at midnight | Individual email HTML |
| `reports.json` | `sync_reports.py` at 11 AM | Index of past model reports |
| `reports/YYYY-MM-DD.txt` | `sync_reports.py` at 11 AM | Individual model detail reports |
| `publish/edge_alerts_latest.json` | `run_edge_alerts.py` (model pipeline) | Live Edge Board data — never manually edit |
| `publish/edge_alerts_YYYY-MM-DD.json` | `run_edge_alerts.py` | Daily archive |

---

## picks.json Workflow
`/plays` reads this file from disk on every request (`force-dynamic`). To update today's plays:
1. Edit `public/data/picks.json` — set `hasPicks: true`, populate `picks[]`
2. Push to GitHub — Vercel redeploys automatically

Pick object schema:
```json
{
  "date": "2026-05-12",
  "sport": "MLB",
  "game": "Rangers @ Yankees",
  "time": "7:05 PM ET",
  "play": "Under 8.5",
  "type": "Total",
  "edge": 9.8,
  "odds": -110,
  "isLean": false
}
```
`isLean: true` for lean plays. `isLean: false` plays get the accent orange left border.
Always include `time` in `"H:MM PM ET"` format.
Always use abbreviations for `game` field — `"BOS @ ATL"` not `"Red Sox @ Braves"`.

---

## Source of Truth Files (NOT in this repo)

**clv_log.json** — Single source of truth for ALL plays (SMC + HMC)
`C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\output\clv_log.json`
- Never manually edit `bets.json` — edit `clv_log.json` first, then run `export_web_data.py`
- SMC plays: `tier: "Standard Edge"` | HMC plays: `tier: "High Conviction"`
- `higherModelConf` stats read from `clv_log.json` where `tier == "High Conviction"` AND `game_date >= 2026-04-13`
- The April 13 cutoff excludes 73 pre-system HC entries (45.1% win rate, -12.6% ROI) — do NOT remove it

**lean_log.DNU.json / lean_counter.DNU.json** — Closed archives. Do not read from or write to these.

**Model output path:** `C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\output\`

---

## Automation Scripts

All scripts that push to the site repo use a self-healing `commit_and_push` helper as of 2026-06-21 (`pull --rebase` → `push`, retries with backoff on a rejected push) so concurrent cron jobs no longer leave a commit unpushed — the old "cannot lock ref" / stale-day failure. Writeup: `OutlierSports/DEPLOY_RACE_FIX_DRAFT.md`.

**sync_emails.py** (`outlier-sports/scripts/`) — laptop, Windows Task Scheduler, 12:00 AM
- Scans `daily_email/` for new HTML files, copies to `public/data/emails/`, updates `emails.json`, commits + pushes
- Still runs **locally** (laptop must be on at midnight) — not yet migrated to the VPS

**sync_reports.py** (`outlier-sports/scripts/`) — VPS cron, 11:50 AM ET
- Copies today's `auto_detail_YYYY-MM-DD.txt` to `public/data/reports/`, updates `reports.json`, commits + pushes
- Moved off the 11:45 slot on 2026-06-21 to stop colliding with `export_web_data.py` (also 11:45)

**run_edge_alerts.py** — model repo (`/opt/mlb-model`), NOT in this repo — VPS cron, 1/3/5 PM + 6:30/8:30 PM ET
- Local source: `C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\run_edge_alerts.py`
- Reads `clv_log.json` + `odds_snapshot_YYYY-MM-DD.json`, generates `edge_alerts_YYYY-MM-DD.json` and `edge_alerts_latest.json`, copies both to `public/data/publish/`, git commits + pushes
- Run manually: `python run_edge_alerts.py` or `python run_edge_alerts.py --date YYYY-MM-DD`
- Single-book snapshot (FanDuel only) — book_discrepancies is always `[]` until multi-book feed added

> **Reminder:** Do not run `export_web_data.py` / `sync_reports.py` from the laptop — the VPS owns all data pushes (see Session Startup above).

---

## stats.json Key Sections
- `lifetime`, `season2026`, `last30Days`, `last7Days` — headline card data
- `byEdgeZone` — row where `range === "7-10%"` drives Standard Model Confidence cards
- `higherModelConf` — drives Higher Model Confidence cards on `/` and `/track-record`; pulls from `clv_log.json` tier="High Conviction" with April 13 cutoff
- `bySport`, `byPlayType` — breakdown tables on /track-record

---

## HMC Plays — Logging Rules
- HMC plays (10%+ edge) auto-log to clv_log.json with `tier: "High Conviction"` and proper `MLB-XXXXX` ID
- `log_result.py grade` auto-grades them
- HMC plays are email-only (not on /plays publicly) but appear in /bet-log once graded
- If an HMC play wasn't captured by model run: add directly to `clv_log.json` (increment MLB-XXXXX ID from last entry), run `export_web_data.py`

---

## Current Model Performance (as of June 21, 2026)
Lifetime: **407-349-16P (53.8%) | ROI: +1.5% | Units: +11.59u**
Standard (7-10% edge): **152-131-5P (53.7%) | ROI: +0.1% | +0.34u**
Higher Model Confidence (10%+, Apr 13+ only): **255-211-10P (54.7%) | ROI: +3.3% | +15.22u**
Source: live `stats.json` (`curl -s https://copaceticsports.com/data/stats.json`). Do NOT run `export_web_data.py` from the laptop — VPS owns data pushes.

---

## Brand Voice (Public Copy)
- Tone: Quiet confidence. Analytical. Research desk, not picks service.
- Core line: *"We only send plays when there's real edge."*
- PASS days are a feature. Never apologize for a no-play day.
- Tagline: *"50,000 Simulations. Find the Outliers."* — always use 50,000, never 10,000.
- No exclamation points, no lock service language, no guarantees.
- **Never use "HMC" in public-facing copy** — use "High Confidence" or "Higher Model Confidence"

---

## Recent Changes

**June 21, 2026**
- **Deploy-race fix shipped** to all three site-pushing scripts (`export_web_data.py`, `run_edge_alerts.py`, `sync_reports.py`). Each now uses a `commit_and_push` helper: after committing, it loops `pull --rebase` → `push` and retries with backoff on a rejected push, instead of leaving the commit unpushed when a concurrent cron job moves the ref. Fixes the recurring "cannot lock ref" / stale-day failure (root cause of 6/21 missing plays). Race-tested on the VPS — concurrent collision self-heals, both commits land.
- **Cron staggered:** `sync_reports.py` moved from 11:45 → **11:50 AM** so it no longer fires in lockstep with `export_web_data.py` (still 11:45). Crontab updated on the VPS.
- Writeup: `OutlierSports/DEPLOY_RACE_FIX_DRAFT.md` (status: DEPLOYED 2026-06-21).

**May 23, 2026**
- **Edge Board launched** (`/edge-alerts`): 4-tab dashboard — Model Edges, Book Discrepancies, Line Movement, Archived Alerts. Reads `public/data/publish/edge_alerts_latest.json` from disk (force-dynamic server component + EdgeBoardClient.tsx).
- **run_edge_alerts.py** written (model pipeline): generates real edge alerts from `clv_log.json` + `odds_snapshot_YYYY-MM-DD.json`. Runs after run_auto.py. Copies output to site repo and git pushes.
- **Edge Board schema**: `model_edges[]`, `book_discrepancies[]` (always empty — single-book), `line_movements[]`. Alert tiers: Price Flip > Steam > Drift > Watch.
- **Price Flip alert**: detected when ML odds cross the +/- boundary (underdog ↔ favorite). Renders as "FLIP" badge with title tooltip.
- **Line Movement table**: move formatted as `−206¢` (moneyline) or `+0.5 pts` (total). Direction column nowrap. Alert badge nowrap. Updated column min-width.
- **Google Analytics**: GA4 tag (G-6YYYERW9YE) added to root layout via next/script afterInteractive.
- **Banner logic**: mutually exclusive — demo (blue) > warnings (amber) > stale (red) > none.

**May 22, 2026**
- **Beestamp tracking started:** All plays (SMC + HC) tracked at betstamp.com/app/my-picks as third-party verification. Bets placed at Novig.

**May 20, 2026**
- **Lean log deprecated:** `lean_log.json` and `lean_counter.json` renamed to `.DNU.json` — closed archives, nothing reads or writes them.
- **log_result.py:** Removed `_grade_leans()` and all lean grading logic. One grading pass on `clv_log` only. Fixed grading date isolation bug.
- **export_web_data.py:** `higherModelConf` stats now read from `clv_log` tier="High Conviction" with April 13 cutoff. UTC→ET fix for date calculations (was writing tomorrow's date after 8 PM ET).
- **run_auto.py:** HC summary label updated to "logged to clv_log -- email only." All changes synced to axiom-baseball-sim.

**May 18, 2026**
- **run_auto.py:** Removed Condition 1 (team label swap bug for away ML dog at -1.5). Condition 2 preserved. Synced to axiom-baseball-sim.

**May 15, 2026**
- **bet-log:** Moneyline bets now display "WSH ML" inline (same style as "Over 7.5", "-1.5", etc.)
- **run_auto.py:** Added clv_log reconciliation — plays logged at open that get knocked off by line movement now surface in the report marked `(open line)`. Synced to axiom-baseball-sim.

---

## Open Items (Do Not Execute Without Spencer's Go-Ahead)
- Platt scaling — deferred; reevaluate at All-Star break (mid-July 2026)

## Done (kept for history)
- **Rebrand to Copacetic Sports** — complete. CSV filename + package.json updated June 4, 2026.
- **DNS cutover for copaceticsports.com** — complete June 11, 2026. Apex form live; outliersportshq.com redirects. `WEB_DEST` updated accordingly.
- **VPS migration** — complete June 5, 2026. Pipeline (model/grade/export/reports/edge-alerts) runs on the DigitalOcean VPS; the VPS is the only machine that pushes data files. Do not run `export_web_data.py`/`sync_reports.py` from the laptop.
