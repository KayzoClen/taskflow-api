const express = require("express");
const config = require("./config");
const tasksRouter = require("./routes/tasks");
const adminRouter = require("./routes/admin");

const app = express();
app.use(express.json());

app.use("/tasks", tasksRouter);
app.use("/admin", adminRouter);

app.listen(config.port, () => {
  console.log(`TaskFlow API en ecoute sur le port ${config.port}`);
});
