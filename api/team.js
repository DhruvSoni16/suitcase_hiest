// GET /api/team?id=erudite
// Returns the team's display name, tagline, and accent color — but NEVER the code.
// The client uses this to render "Erudite · The Intelligent" on screen.

const { TEAMS } = require("./_teams");

module.exports = function handler(req, res) {
  const id = (req.query.id || "").toLowerCase();
  const team = TEAMS[id];

  if (!team) {
    return res.status(404).json({ error: "Unknown team" });
  }

  // Return only safe, public fields. NEVER include `code`.
  return res.status(200).json({
    id,
    name: team.name,
    tagline: team.tagline,
    accent: team.accent,
  });
};
