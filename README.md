# TaskFlow API

TaskFlow API est une API REST développée avec **Node.js** et **Express** permettant de gérer une liste de tâches.

## Prérequis

* Node.js
* npm

## Installation

Cloner le projet puis installer les dépendances :

```bash
git clone https://github.com/KayzoClen/taskflow-api.git
cd taskflow-api
npm install
```

## Démarrage

Lancer l'API avec :

```bash
npm start
```

L'API est disponible sur :

```text
http://localhost:3000
```

## Routes

* `GET /tasks` — récupérer toutes les tâches
* `GET /tasks/:id` — récupérer une tâche
* `POST /tasks` — créer une tâche
* `DELETE /tasks/:id` — supprimer une tâche
* `GET /admin/export` — exporter les tâches

## Administration

La route `/admin/export` nécessite une clé d'API.

La clé doit être fournie via l'en-tête `x-api-key`.

> Ne jamais publier une vraie clé d'API dans le dépôt.

## Structure

```text
taskflow-api/
├── src/
│   ├── data/
│   ├── routes/
│   ├── config.js
│   └── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Stockage

Les tâches sont actuellement stockées en mémoire et sont perdues lors du redémarrage du serveur.

## Statut

Projet en cours de développement.

## Licence

Le projet est actuellement indiqué comme `UNLICENSED`.
