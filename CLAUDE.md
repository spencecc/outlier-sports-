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
