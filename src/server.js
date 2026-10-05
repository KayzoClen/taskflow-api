const express = require("express");
const config = require("./config");
const tasksRouter = require("./routes/tasks");
const adminRouter = require("./routes/admin");

if (!config.adminApiKey) {
  console.warn("ATTENTION: ADMIN_API_KEY n'est pas definie, /admin/export restera inaccessible (403).");
}

const app = express();
app.use(express.json());

app.use("/tasks", tasksRouter);
app.use("/admin", adminRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(config.port, () => {
  console.log(`TaskFlow API en ecoute sur le port ${config.port}`);
});
