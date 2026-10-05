# ADR 0001 — Stocker les tâches en mémoire

- **Statut :** accepté
- **Date :** 2026-10-05
- **Version concernée :** 0.1.0 (V0)

## Contexte

TaskFlow API doit stocker des tâches pour pouvoir les lister, les créer et les supprimer. Pour la V0, l'objectif est d'avoir une API qui démarre tout de suite, sans rien installer d'autre que Node.js.

## Décision

Les tâches sont stockées dans un tableau JavaScript en mémoire, dans [`src/data/taskStore.js`](../../src/data/taskStore.js). Il n'y a ni base de données ni fichier.

## Pourquoi cette décision

1. **Simplicité de mise en place.** Un tableau en mémoire ne demande aucune installation ni configuration : `npm install` puis `npm start` suffisent pour lancer l'API.
2. **Aucune dépendance externe.** Sans base de données, il n'y a rien d'autre à installer, à démarrer ou à maintenir que Node.js et Express.
3. **Le besoin actuel ne demande pas plus.** Le projet est un support de cours en V0 : il manipule quelques tâches d'exemple et n'a pas besoin de les conserver d'une session à l'autre.

Une base de données ou un fichier aurait apporté la persistance, mais au prix d'une installation et d'un code plus lourds, pour un besoin qui n'existe pas encore.

## Conséquences

**Ce qu'on accepte en échange**

- Les données sont perdues à chaque redémarrage du serveur.
- On ne peut pas lancer plusieurs instances du serveur : chacune aurait ses propres tâches.
- Tout le code qui lit ou modifie les tâches doit passer par `taskStore.js`.

## Quand revoir cette décision

Dès que l'un de ces besoins apparaît :

- les tâches doivent survivre à un redémarrage ;
- le volume de données grossit ;
- il faut plusieurs instances du serveur.

Il faudra alors choisir un stockage persistant (par exemple un fichier JSON ou une base SQLite) et rédiger un nouvel ADR qui remplace celui-ci.
