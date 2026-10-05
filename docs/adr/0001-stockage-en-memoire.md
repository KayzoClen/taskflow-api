# ADR 0001 — Stocker les tâches en mémoire

- **Statut :** Accepté
- **Date :** 2026-10-05
- **Auteur :** Pierre Assignon

## Contexte

TaskFlow API est une API Express de gestion de tâches, en version 0.1.0. Elle doit lister, créer et supprimer des tâches, et permettre un export admin.

Pour cette V0, le projet doit démarrer tout de suite : `npm install` puis `npm start`, sans installer autre chose que Node.js. Le volume est faible (trois tâches d'exemple) et un seul processus suffit.

Le code reflète déjà ce cadre : `package.json` ne déclare qu'Express, et toutes les lectures et écritures passent par `src/data/taskStore.js`.

## Options écartées

- **Fichier JSON sur disque.** Les tâches survivraient à un redémarrage, toujours sans dépendance. Il faudrait toutefois gérer les écritures, les erreurs de fichier et les accès simultanés, pour un besoin qui n'existe pas encore.
- **SQLite.** Vraie persistance dans un seul fichier, mais avec un module natif à installer, un schéma et des migrations. Trop lourd pour une V0 de formation.
- **PostgreSQL ou MongoDB.** Persistance solide et plusieurs instances possibles. Il faut un service à lancer, une configuration et des identifiants. Disproportionné tant que l'API n'a pas de vrais utilisateurs.

## Décision

Les tâches sont un tableau JavaScript en mémoire, dans `src/data/taskStore.js`. Il n'y a ni base de données ni fichier.

Les routes n'accèdent pas au tableau directement. Elles passent par `getAll`, `getById`, `create` et `remove`. Le jour où le stockage change, les routes peuvent rester les mêmes.

## Conséquences

**Ce qu'on gagne**

- L'API démarre sans service externe.
- Le stockage tient dans un seul fichier, facile à lire.
- Un redémarrage remet les trois tâches d'exemple, ce qui simplifie les essais manuels.

**Ce qu'on accepte**

- Toute tâche créée ou supprimée disparaît à l'arrêt du processus.
- Deux instances de l'API ne partagent pas les mêmes tâches.
- `dataRetentionDays` dans `src/config.js` n'a aucun effet tant que rien n'est conservé.

**Quand revoir cette décision**

Dès que les tâches doivent survivre à un redémarrage, que plusieurs instances doivent partager les données, ou que le volume augmente. On choisira alors un stockage persistant et on écrira un nouvel ADR.
