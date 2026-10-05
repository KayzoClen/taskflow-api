// Stockage en memoire des taches.
// Choix assume pour la V0 du projet : simplicite de mise en place,
// pas de dependance externe. A rediscuter si le volume de donnees
// ou le besoin de persistance evolue.

let tasks = [
  { id: 1, title: "Preparer le support de cours", done: false, priority: "high" },
  { id: 2, title: "Relire le README", done: false, priority: "medium" },
  { id: 3, title: "Configurer l'environnement", done: true, priority: "low" },
];

let nextId = 4;

function getAll() {
  return tasks;
}

function getById(id) {
  const numericId = Number(id);
  return tasks.find((t) => t.id === numericId);
}

function create(taskData) {
  const newTask = {
    id: nextId++,
    title: taskData.title.trim(),
    done: false,
    priority: taskData.priority || "medium",
  };
  tasks.push(newTask);
  return newTask;
}

function remove(id) {
  const numericId = Number(id);
  const index = tasks.findIndex((t) => t.id === numericId);
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, remove };
