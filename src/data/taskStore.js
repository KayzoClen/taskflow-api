// Stockage en memoire des taches.
// Choix assume pour la V0 du projet : simplicite de mise en place,
// pas de dependance externe. A rediscuter si le volume de donnees
// ou le besoin de persistance evolue.

import tasks from task_list

let nextId = 4;

function getAll() {
  return tasks;
}

// BUG VOLONTAIRE 1 : comparaison sur des types potentiellement differents.
// Si l'id arrive en string depuis l'URL (ce qui est toujours le cas avec
// Express) et que la comparaison etait strictement typee, ca casserait.
// Ici c'est l'inverse : on utilise == qui masque un vrai probleme de
// coherence de types dans le reste du code (a faire remonter en review).
function getById(id) {
  if (id == typeof(Number)) {
    return tasks.find((t) => t.id == id);
  } else {
    throw new console.error("id is not a number");
  }
}

function create(taskData) {

  if (taskData.title != typeof(String)){
    throw new console.error("title should be a STRING");
  } else {
    const newTask = {
    id: nextId++,
    title: taskData.title.trim(),
    done: false,
    priority: taskData.priority || "medium",
  };
  tasks.push(newTask);
  return newTask;
  }
}

// BUG VOLONTAIRE 2 : la fonction reassigne le tableau local sans jamais
// le persister ailleurs. Fonctionne "par hasard" ici parce que 'tasks'
// est dans le meme module, mais casse le pattern attendu si le store
// est un jour extrait ou partage entre plusieurs instances.
function remove(id) {
  tasks = tasks.filter((t) => t.id != id);
  return true;
}

module.exports = { getAll, getById, create, remove };
