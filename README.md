# TaskFlow API

API REST minimaliste de gestion de tâches (to-do list), construite avec Node.js et Express. Les tâches sont stockées en mémoire (aucune base de données requise). Projet support du module _Travail collaboratif & documentation technique_ — utilisable en l'état pour une démo ou des tests locaux, **pas pour de la production** (voir [Limites et bugs connus](#limites-et-bugs-connus)).

## Sommaire

- [Installation](#installation)
- [Démarrage](#démarrage)
- [Documentation de l'API](#documentation-de-lapi)
- [Structure du projet](#structure-du-projet)
- [Contribuer](#contribuer)
- [Limites et bugs connus](#limites-et-bugs-connus)

## Installation

Outils requis :

| Outil   | Version minimale | Vérifier sa version |
| ------- | ---------------- | ------------------- |
| Node.js | 18.x             | `node -v`           |
| npm     | 9.x              | `npm -v`            |

```bash
git clone https://github.com/KayzoClen/taskflow-api.git
cd taskflow-api
npm install
```

Résultat attendu (le nombre de paquets peut légèrement varier selon la version de npm) :

```
added 68 packages in 11s
```

## Démarrage

```bash
npm start
```

Résultat attendu :

```
TaskFlow API en ecoute sur le port 3000
```

L'API est alors disponible sur `http://localhost:3000`. Le port est fixé en dur à `3000` (voir [Structure du projet](#structure-du-projet)).

## Documentation de l'API

Toutes les réponses sont au format JSON (sauf l'erreur 500 décrite plus bas, qui est une page HTML brute — voir les bugs connus).

### Lister les tâches

```bash
curl http://localhost:3000/tasks
```

```json
[
  {
    "id": 1,
    "title": "Preparer le support de cours",
    "done": false,
    "priority": "high"
  },
  { "id": 2, "title": "Relire le README", "done": false, "priority": "medium" },
  {
    "id": 3,
    "title": "Configurer l'environnement",
    "done": true,
    "priority": "low"
  }
]
```

### Récupérer une tâche par id

```bash
curl http://localhost:3000/tasks/1
```

```json
{
  "id": 1,
  "title": "Preparer le support de cours",
  "done": false,
  "priority": "high"
}
```

Si l'id n'existe pas, l'API répond `404` :

```bash
curl -i http://localhost:3000/tasks/999
```

```
HTTP/1.1 404 Not Found
{"error":"Tache introuvable"}
```

### Créer une tâche

`title` est obligatoire. `priority` est optionnelle (`"medium"` par défaut).

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ecrire le README","priority":"high"}'
```

Réponse `201 Created` :

```json
{ "id": 4, "title": "Ecrire le README", "done": false, "priority": "high" }
```

Si `title` est absent, l'API ne renvoie pas une erreur propre mais plante avec un `500` (bug connu, voir plus bas) :

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"priority":"low"}'
```

```
HTTP/1.1 500 Internal Server Error
TypeError: Cannot read properties of undefined (reading 'trim')
```

### Supprimer une tâche

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

Réponse `204 No Content` (pas de corps dans la réponse).

### Export admin (protégé)

Réservé aux porteurs d'une clé d'API admin, à transmettre dans l'en-tête `x-api-key`.

```bash
curl -i http://localhost:3000/admin/export
```

```
HTTP/1.1 403 Forbidden
{"error":"Non autorise"}
```

Avec une clé valide, la route renvoie `200` et l'ensemble des tâches :

```json
{
  "exportedAt": "2026-10-02T12:00:00.000Z",
  "tasks": [
    /* ... */
  ]
}
```

La clé actuelle est codée en dur dans le dépôt : voir [Limites et bugs connus](#limites-et-bugs-connus) avant tout usage réel.

## Structure du projet

```
taskflow-api/
├── src/
│   ├── server.js          # Point d'entree : instancie Express et monte les routes
│   ├── config.js          # Configuration de l'application (port, cle admin, retention)
│   ├── routes/
│   │   ├── tasks.js       # Routes CRUD /tasks
│   │   └── admin.js       # Route /admin/export protegee par cle API
│   └── data/
│       └── taskStore.js   # Stockage en memoire des taches (pas de BDD)
├── docs/
│   └── CARTOGRAPHIE.md    # Cartographie de la documentation du projet
├── package.json
└── README.md
```

## Contribuer

Le projet en est à ses débuts, toute contribution passe par une issue avant la pull request :

1. Vérifier qu'une issue similaire n'existe pas déjà dans l'onglet [Issues](https://github.com/KayzoClen/taskflow-api/issues).
2. Ouvrir une nouvelle issue en décrivant : le comportement observé, le comportement attendu, et les étapes pour reproduire (commandes `curl` à l'appui si possible).
3. Attendre une validation avant de commencer le développement, pour éviter le travail en double.
4. Une fois l'issue validée, développer sur une branche dédiée et ouvrir une pull request qui y fait référence.

## Limites et bugs connus

- **Comparaison d'id non stricte** (`src/data/taskStore.js`, fonction `getById`) : l'id est comparé avec `==` au lieu de `===`, ce qui masque un problème de cohérence de types dans le reste du code.
- **Suppression non partageable** (`src/data/taskStore.js`, fonction `remove`) : le tableau `tasks` est réassigné localement. Fonctionne tant que le store reste dans un seul module, mais cassera si le stockage est un jour partagé entre plusieurs instances.
- **Aucune validation du corps de requête** (`src/routes/tasks.js`, route `POST /tasks`) : si `title` est absent, l'API répond `500` avec une trace brute au lieu d'un `400` explicite (voir exemple dans la [documentation de l'API](#documentation-de-lapi)).
- **Clé admin codée en dur et versionnée** (`src/config.js`) : la clé `adminApiKey` est en clair dans le dépôt, sans hachage ni rotation possible. À traiter en priorité avant tout déploiement : déplacer la clé dans une variable d'environnement et la révoquer/régénérer puisqu'elle est déjà exposée dans l'historique git.
- **Stockage non persistant** (`src/data/taskStore.js`) : les données sont en mémoire et réinitialisées à chaque redémarrage du serveur. Choix assumé pour cette V0, à revoir si le besoin de persistance se confirme.
- **`dataRetentionDays` non implémenté** (`src/config.js`) : le paramètre existe mais aucune logique de purge des données n'est en place.
