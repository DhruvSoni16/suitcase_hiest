// Server-side team configuration.
// This file lives in /api so it ONLY runs on the server — never sent to the browser.
//
// Codes are read from Vercel environment variables (set in the Vercel dashboard:
// Settings → Environment Variables). This lets you rotate codes without redeploying.
//
// Fallback values are provided for local development. Replace them or use a .env file.

const TEAMS = {
  erudite: {
    name: "Erudite",
    tagline: "The Intelligent",
    accent: "#6ad0ff",
    code: (process.env.TEAM_ERUDITE_CODE || "472").split("").map(Number),
  },
  amity: {
    name: "Amity",
    tagline: "The Peaceful",
    accent: "#ffd966",
    code: (process.env.TEAM_AMITY_CODE || "193").split("").map(Number),
  },
  candor: {
    name: "Candor",
    tagline: "The Honest",
    accent: "#e8eef7",
    code: (process.env.TEAM_CANDOR_CODE || "805").split("").map(Number),
  },
  dauntless: {
    name: "Dauntless",
    tagline: "The Brave",
    accent: "#ff5a4a",
    code: (process.env.TEAM_DAUNTLESS_CODE || "637").split("").map(Number),
  },
};

module.exports = { TEAMS };
