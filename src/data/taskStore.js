let tasks = [
  {
    id: 1,
    title: "Preparer le support de cours",
    done: false,
    priority: "high",
  },
  {
    id: 2,
    title: "Relire le README",
    done: false,
    priority: "medium",
  },
  {
    id: 3,
    title: "Configurer l'environnement",
    done: true,
    priority: "low",
  },
];

let nextId = 4;

const allowedPriorities = ["low", "medium", "high"];

function getAll() {
  return tasks;
}

function getById(id) {
  const taskId = Number(id);

  if (!Number.isInteger(taskId)) {
    return undefined;
  }

  return tasks.find((task) => task.id === taskId);
}

function create(taskData) {
  if (!taskData.title || typeof taskData.title !== "string") {
    throw new Error("Title is required");
  }

  const priority = taskData.priority || "medium";

  if (!allowedPriorities.includes(priority)) {
    throw new Error("Invalid priority");
  }

  const newTask = {
    id: nextId++,
    title: taskData.title.trim(),
    done: false,
    priority,
  };

  tasks.push(newTask);

  return newTask;
}

function remove(id) {
  const taskId = Number(id);

  if (!Number.isInteger(taskId)) {
    return false;
  }

  const initialLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== taskId);

  return tasks.length < initialLength;
}

module.exports = {
  getAll, getById, create, remove,
};