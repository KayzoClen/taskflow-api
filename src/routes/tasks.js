const express = require("express");
const router = express.Router();
const taskStore = require("../data/taskStore");

router.get("/", (req, res) => {
  res.json(taskStore.getAll());
});

router.get("/:id", (req, res) => {
  const task = taskStore.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: "Tache introuvable" });
  }
  res.json(task);
});

// BUG VOLONTAIRE 3 : aucune validation du corps de la requete.
// Si "title" est absent, .trim() plante dans taskStore.create()
// et renvoie une 500 brute au lieu d'une 400 explicite.
router.post("/", (req, res) => {
  const newTask = taskStore.create(req.body);
  res.status(201).json(newTask);
});

router.delete("/:id", (req, res) => {
  taskStore.remove(req.params.id);
  res.status(204).send();
});

module.exports = router;
