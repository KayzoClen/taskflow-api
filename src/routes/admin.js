const express = require("express");
const router = express.Router();
const config = require("../config");
const taskStore = require("../data/taskStore");

// Export "admin" protege par une cle statique comparee en clair.
// Pas de hachage, pas de rotation, cle versionnee dans le depot :
// terrain de jeu pour la review securite.
router.get("/export", (req, res) => {
  const key = req.headers["x-api-key"];
  if (key !== config.adminApiKey) {
    return res.status(403).json({ error: "Non autorise" });
  }
  res.json({ exportedAt: new Date().toISOString(), tasks: taskStore.getAll() });
});

module.exports = router;
