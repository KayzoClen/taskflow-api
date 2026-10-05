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

router.post("/", (req, res) => {
  const { title } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Le champ 'title' est requis et doit etre une chaine non vide" });
  }
  const newTask = taskStore.create(req.body);
  res.status(201).json(newTask);
});

router.delete("/:id", (req, res) => {
  const deleted = taskStore.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Tache introuvable" });
  }
  res.status(204).send();
});

module.exports = router;
