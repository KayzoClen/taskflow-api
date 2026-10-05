# ADR-0001 : Stocker les tâches en mémoire, dans le processus Node.js

- **Statut** : Accepté
- **Date** : 2026-10-05
- **Auteurs** : Othmane Asli, Victor Kono Manetti, Yanis Calonge, Reda Rahmani

## Contexte

TaskFlow API est une API REST de gestion de tâches (Node.js + Express, seule dépendance déclarée dans `package.json`). Elle doit stocker des tâches (`id`, `title`, `done`, `priority`) et les exposer via `GET/POST/DELETE /tasks` et `GET /admin/export`.

Ce qui montre la décision dans le dépôt :
- `src/data/taskStore.js` : les tâches sont un tableau JavaScript (`let tasks = [...]`) et les identifiants viennent d'un compteur (`let nextId = 4`). Le commentaire en tête du fichier assume ce choix : « Choix assumé pour la V0 du projet : simplicité de mise en place, pas de dépendance externe. À rediscuter si le volume de données ou le besoin de persistance évolue. »
- `src/routes/tasks.js` et `src/routes/admin.js` : toutes les lectures et écritures passent par ce module (`getAll`, `getById`, `create`, `remove`).
- `package.json` : aucun pilote de base de données ni ORM. `npm start` suffit pour lancer l'API.
- `git log` : le stockage existe depuis le premier commit (`0e13cce`, « First commit ») et n'a pas changé depuis.

Contraintes :
- L'API sert de support à un module de formation sur le travail collaboratif (description de `package.json`). Elle doit donc pouvoir être installée et lancée en une commande par toutes les équipes.
- C'est une V0 avec peu de données et un seul processus (hypothèse : aucun besoin de montée en charge à ce stade).

## Options envisagées

| Option | Avantages | Inconvénients |
|---|---|---|
| **A. Tableau en mémoire** (retenue) | Aucune installation, aucune dépendance, démarrage immédiat ; code très court et lisible | Données perdues à chaque redémarrage ; impossible de lancer plusieurs instances ; identifiants réinitialisés |
| **B. Fichier JSON sur disque** | Les données survivent au redémarrage ; toujours sans dépendance externe | Écritures concurrentes risquées ; gestion des erreurs d'E/S ; fichier de données à exclure de Git |
| **C. SQLite** (ex. `better-sqlite3`) | Vraie persistance, requêtes SQL, base dans un seul fichier | Module natif à compiler (soucis possibles sous Windows/macOS) ; schéma et migrations à maintenir |
| **D. Serveur de base de données** (PostgreSQL, MongoDB) | Persistance robuste, plusieurs instances possibles, prêt pour la production | Service à installer ou à lancer avec Docker ; configuration et identifiants à gérer ; bien trop lourd pour une V0 de formation |

## Décision

**Nous stockons les tâches dans un tableau en mémoire du processus Node.js, derrière le module `src/data/taskStore.js`.**

Justification : l'objectif actuel est que chaque contributeur puisse cloner le dépôt et lancer l'API avec `npm start`, sans rien installer d'autre. La persistance n'est pas un besoin de la V0. Comme le stockage est isolé dans un seul module, il pourra être remplacé plus tard sans toucher aux routes.

## Conséquences

**Positives**
- L'installation se résume à `npm install` puis `npm start`. Aucun service externe n'est nécessaire.
- L'état des données est facile à comprendre et à réinitialiser (un redémarrage suffit), ce qui aide les tests manuels.
- Les routes n'accèdent aux données que par l'interface `getAll` / `getById` / `create` / `remove`.

**Négatives**
- Toute tâche créée ou supprimée est perdue au redémarrage. Les données d'exemple (3 tâches) reviennent à chaque fois.
- L'API ne peut tourner que dans une seule instance : deux processus auraient deux listes différentes.
- L'interface est synchrone. Passer à une base de données obligera à rendre `taskStore` asynchrone et à modifier toutes les routes.
- Le paramètre `dataRetentionDays: 90` de `src/config.js` n'a aucun effet tant que rien n'est conservé.

**Conditions de remise en cause**
- Les données doivent survivre à un redémarrage ou à un déploiement.
- L'API doit tourner en plusieurs instances ou être exposée à de vrais utilisateurs.
- Le volume de tâches devient trop grand pour la mémoire, ou des requêtes plus riches (filtres, tri, pagination) sont nécessaires.
