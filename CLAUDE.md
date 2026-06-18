@AGENTS.md

# WebMaster — Copacetic Sports

You are the **WebMaster** window for Copacetic Sports (formerly Outlier Sports). Your lane: the site repo, Vercel deploys, data files, logging pipeline, and automation scripts. Do not touch files owned by EmailMaster (`daily_email/` HTML files) without flagging Spencer first. ShotCaller coordinates cross-window decisions.

---

## Session Startup — Run These First, Every Time
1. `python export_web_data.py` — regenerates `bets.json` + `stats.json`, pushes to GitHub
2. `python scripts/sync_reports.py` — syncs today's model report to the site

Do not skip. Today's logged bets will not appear on /bet-log until export runs.

---

## Your Directory
You are in the site repo: `C:\Users\spenc\OneDrive\Desktop\OutlierSports\outlier-sports\`

**GitHub:** github.com/spencecc/outlier-sports- — push to `main` triggers Vercel auto-deploy.
**Live site:** outliersportshq.com (copaceticsports.com secured but DNS not yet pointed)

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

## Automation Scripts (`outlier-sports/scripts/`)

**sync_emails.py** — runs at 12:00 AM daily
- Scans `daily_email/` for new HTML files, copies to `public/data/emails/`, updates `emails.json`, commits + pushes

**sync_reports.py** — runs at 11:00 AM daily
- Copies today's `auto_detail_YYYY-MM-DD.txt` to `public/data/reports/`, updates `reports.json`, commits + pushes

**run_edge_alerts.py** — runs after run_auto.py (model pipeline, NOT in this repo)
- Location: `C:\Users\spenc\OneDrive\Desktop\Python.Manus\gemini_mlb_v2.2\run_edge_alerts.py`
- Reads `clv_log.json` + `odds_snapshot_YYYY-MM-DD.json`, generates `edge_alerts_YYYY-MM-DD.json` and `edge_alerts_latest.json`, copies both to `public/data/publish/`, git commits + pushes
- Run manually: `python run_edge_alerts.py` or `python run_edge_alerts.py --date 2026-05-23`
- Single-book snapshot (FanDuel only) — book_discrepancies is always `[]` until multi-book feed added

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

## Current Model Performance (as of May 23, 2026)
Overall: **311-261-11P (54.4%) | ROI: +2.4% | Units: +13.6u**
Standard (7-10% edge): **116-92-5P (55.8%) | ROI: +4.0% | +8.38u**
Higher Model Confidence (10%+, Apr 13+ only): **195-162-5P (54.6%) | ROI: +2.6% | +9.19u**
Run `export_web_data.py` for current stats.

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

**June 18, 2026 — ACTIVE ISSUE: data frozen at June 16 (model pipeline, NOT the site)**
- **Symptom:** /bet-log, /reports, and /edge-alerts all stopped updating. Two days (6/17, 6/18) with no new graded plays.
- **Root cause is upstream on the VPS, not the website.** Three independent model-derived outputs all froze on the same date, **2026-06-16**:
  - `bets.json` → last bet 6/16 | `reports.json` → last report 6/16 | `publish/edge_alerts_*` → last file 6/16 (`edge_alerts_latest.json` byte-identical to 6/16)
- **Site scripts are healthy** — still committing hourly (`stats.json` regenerated 6/18 15:15Z). They keep re-publishing stale data because there's nothing new to pull.
- **Key clue:** the 6/17 email sent fine and says *"the model ran the full slate this morning... nothing cleared the edge threshold."* But a normal PASS day (e.g. 6/15, 0 plays) STILL produces a report + edge_alerts — 6/17 produced none. So the pipeline broke at the report/log-writing stage between 6/16→6/17.
- **Prime suspect: incomplete VPS migration.** `sync_reports.py` now points to `MODEL_OUTPUT = "/opt/mlb-model/output"` (Linux/VPS). CLAUDE.md flagged TWO paths needing migration — `MODEL_OUTPUT` (done) AND `WEB_DEST` in `export_web_data.py`. Likely `run_auto.py` / `run_edge_alerts.py` / `export_web_data.py` paths weren't all migrated consistently — model output is landing somewhere the sync/export scripts don't read, or the run dies at the write step.
- **Can't fix from web/remote session:** `run_auto.py`, `run_edge_alerts.py`, `export_web_data.py` live on the VPS at `/opt/mlb-model/` — not in this repo, not reachable from an isolated clone.
- **Fix checklist (do on the VPS):**
  1. `ls -la /opt/mlb-model/output/` — present? `auto_detail_2026-06-17.txt`, `auto_detail_2026-06-18.txt`, `edge_alerts_2026-06-1{7,8}.json`
     - MISSING → `run_auto.py` is crashing; check cron/systemd logs for the 6/17 & 6/18 morning runs.
     - PRESENT → path mismatch; reconcile `export_web_data.py`/`sync_reports.py` read paths with where the model writes.
  2. `stat` the VPS `clv_log.json` + check last entry date / confirm its post-migration location.
  3. Grep `export_web_data.py` + `run_edge_alerts.py` for leftover `C:\Users\spenc\...` paths; point `WEB_DEST` + clv/model-output paths at the VPS locations.
- **Follow-up (offered, not yet built):** add a staleness guard to `sync_reports.py` (currently silently no-ops on missing data, line 76-78) so a multi-day pipeline outage alerts instead of going unnoticed.

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
- Rebrand code changes (waiting on Spencer per session)
- DNS cutover for copaceticsports.com
- WEB_DEST update in export_web_data.py to copaceticsports.com
- Platt scaling — deferred; reevaluate at All-Star break (mid-July 2026)
- **VPS migration (HIGH PRIORITY — before subscription launch)** — Full step-by-step guide written May 15, 2026. Two path changes needed: `WEB_DEST` in `export_web_data.py` and `MODEL_OUTPUT` in `sync_reports.py`. DigitalOcean, Ubuntu 24.04, $6/mo. Guide is in conversation history from May 15.
