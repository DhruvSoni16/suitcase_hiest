# Crack the Code · Suitcase Heist

A 3-digit suitcase-lock puzzle game for **four factions** playing simultaneously, with **server-side code validation**.

The secret codes never leave the server. The browser only learns whether a guess is right or wrong — so even players who open DevTools can't cheat.

---

## The one URL to share

After deploying, share a **single URL** with all your players:

```
https://yoursite.vercel.app
```

This lands them on a faction-selection screen with four tiles:

| Faction   | Tagline           | Accent |
|-----------|-------------------|--------|
| Erudite   | The Intelligent   | Blue   |
| Amity     | The Peaceful      | Yellow |
| Candor    | The Honest        | White  |
| Dauntless | The Brave         | Red    |

Each player clicks their faction and is taken to their team's game at `/game.html?team=<faction>`. Each faction has its own secret code.

If you'd prefer to send each team a direct link (no faction picker), use these:

- `https://yoursite.vercel.app/game.html?team=erudite`
- `https://yoursite.vercel.app/game.html?team=amity`
- `https://yoursite.vercel.app/game.html?team=candor`
- `https://yoursite.vercel.app/game.html?team=dauntless`

---

## Project layout

```
suitcase-heist/
├── api/
│   ├── _teams.js     ← team config (server-only — codes live here)
│   ├── team.js       ← GET /api/team?id=erudite  → returns name/tagline/accent (no code)
│   └── check.js      ← POST /api/check            → validates a guess
├── index.html        ← landing page (faction picker)
├── game.html         ← the actual game
├── package.json
└── README.md
```

No `vercel.json` needed — Vercel auto-detects the layout. Static HTML at the root, serverless functions under `/api`.

---

## Setting the codes

### Option 1 — Environment variables (recommended)

In the Vercel dashboard: **Settings → Environment Variables**. Add these:

| Name | Value (example) |
|---|---|
| `TEAM_ERUDITE_CODE`   | `472` |
| `TEAM_AMITY_CODE`     | `193` |
| `TEAM_CANDOR_CODE`    | `805` |
| `TEAM_DAUNTLESS_CODE` | `637` |

Each value must be a 3-digit string of digits 0–9. After saving, **redeploy** (or push a new commit) to apply.

You can rotate codes anytime by editing the env vars and redeploying — no code change needed.

### Option 2 — Edit `api/_teams.js` directly

Open `api/_teams.js` and change the fallback values:

```js
erudite: {
  name: "Erudite",
  tagline: "The Intelligent",
  accent: "#6ad0ff",
  code: (process.env.TEAM_ERUDITE_CODE || "472").split("").map(Number),
  //                                       ^^^ change this fallback
},
```

The fallback runs when the env var isn't set (useful for local development).

---

## Customizing factions

Open `api/_teams.js`. Each faction has a `name`, `tagline`, and `accent`:

```js
erudite: {
  name: "Erudite",              // shown big at the top of the game
  tagline: "The Intelligent",   // shown as the subtitle
  accent: "#6ad0ff",            // tints the display, dial highlight, etc.
  code: ...
}
```

If you want to change a faction icon on the landing page, edit the relevant `<svg>` block in `public/index.html`.

---

## Local development

```bash
npm install -g vercel
vercel dev
```

Opens on `http://localhost:3000`. The landing page is at `/`, the game at `/game.html?team=<faction>`.

For local env vars, create a `.env` file at the project root:

```
TEAM_ERUDITE_CODE=472
TEAM_AMITY_CODE=193
TEAM_CANDOR_CODE=805
TEAM_DAUNTLESS_CODE=637
```

---

## Deploying to Vercel

From the project root:

```bash
vercel              # first deploy — links the project
vercel --prod       # promote to production
```

Or push the folder to a GitHub repo and import it in the Vercel dashboard.

---

## Security notes

- **The code is never sent to the client.** `/api/team` returns only name, tagline, and accent. `/api/check` returns only `{ correct: true | false }`.
- **No rate limiting.** For a friendly team event this is fine. If you're worried about brute force (1000 guesses max), add a rate-limit middleware or check attempts in Vercel KV.
- **No persistence.** Attempts/best score live only in the player's browser and reset on refresh. If you want a real cross-team leaderboard later, wire `/api/check` to Vercel KV or a database.

---

## What players see

1. **Landing page** — four faction tiles, each with its own color and icon. They click theirs.
2. **Game screen** — their faction name displayed prominently in their faction color, the subtitle showing the tagline ("The Intelligent" etc.), a 3D suitcase with three brass dials, and a numpad below. A small "← Switch faction" link in the corner lets them go back.
3. **Cracking** — each digit press spins a dial. The third digit auto-submits to the server. Wrong → red display + shake + dials reshuffle. Right → green display + lid pops open + gold appears + "You cracked the code" banner.

Keyboard also works: `0–9`, `Enter` to submit, `Esc`/`Backspace` to clear.
