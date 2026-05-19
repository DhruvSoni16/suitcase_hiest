// POST /api/check
// Body: { team: "alpha", guess: [4, 7, 2] }
// Returns: { correct: true | false }
//
// The actual code never leaves the server. The client only learns
// whether its guess was right.

const { TEAMS } = require("./_teams");

module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel parses JSON automatically when Content-Type is application/json.
  // Fall back to manual parse just in case.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const teamId = (body.team || "").toLowerCase();
  const guess = Array.isArray(body.guess) ? body.guess : null;

  const team = TEAMS[teamId];
  if (!team) {
    return res.status(404).json({ error: "Unknown team" });
  }

  if (!guess || guess.length !== team.code.length) {
    return res.status(400).json({ error: "Invalid guess format" });
  }

  // Coerce to integers and validate range
  const normalized = guess.map((d) => Number(d));
  if (normalized.some((d) => !Number.isInteger(d) || d < 0 || d > 9)) {
    return res.status(400).json({ error: "Digits must be integers 0-9" });
  }

  const correct = team.code.every((d, i) => d === normalized[i]);
  return res.status(200).json({ correct });
};
