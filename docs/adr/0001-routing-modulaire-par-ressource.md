# ADR 0001 — Router Express dédié par ressource

- **Statut :** accepté
- **Date :** 2026-10-05
- **Version concernée :** 0.1.0 (V0)

## Contexte

TaskFlow API expose déjà deux familles de routes : la gestion des tâches (`/tasks`) et une fonctionnalité d'administration (`/admin/export`). D'autres ressources viendront probablement s'ajouter par la suite (utilisateurs, catégories, etc.).

Pour la V0, l'objectif est de pouvoir ajouter une nouvelle ressource sans toucher au reste de l'application, tout en gardant un seul fichier d'entrée simple à lire (`src/server.js`). L'équipe est petite et le projet est un support pédagogique : il ne doit pas nécessiter de framework additionnel ni de couche d'abstraction lourde pour rester compréhensible.

## Décision

Chaque ressource a son propre routeur Express (`express.Router()`), défini dans un fichier dédié sous `src/routes/` :

- [`src/routes/tasks.js`](../../src/routes/tasks.js) pour `/tasks`
- [`src/routes/admin.js`](../../src/routes/admin.js) pour `/admin`

Ces routeurs sont montés explicitement dans [`src/server.js`](../../src/server.js) :

```js
app.use("/tasks", tasksRouter);
app.use("/admin", adminRouter);
```

Chaque fichier de routes appelle directement le module de données correspondant (ex. `taskStore.js`) — il n'y a pas de couche "controller" ou "service" intermédiaire entre la route et l'accès aux données.

## Pourquoi cette décision

1. **Isolation par ressource.** Ajouter une ressource revient à créer un nouveau fichier dans `src/routes/` et à l'enregistrer dans `server.js`, sans modifier le code des routes existantes.
2. **Lisibilité immédiate.** `server.js` reste un point d'entrée court : on y voit d'un coup d'œil toutes les ressources exposées et leur préfixe d'URL.
3. **Pas de dépendance ni de couche supplémentaire.** `express.Router()` fait partie d'Express lui-même ; aucun framework structurant (type NestJS avec modules/controllers/DI) n'est nécessaire pour ce périmètre.

### Options écartées

- **Un seul fichier de routes monolithique.** Toutes les routes définies directement dans `server.js`. Rejeté : ne tiendrait pas dès l'ajout d'une troisième ressource, et mélangerait configuration du serveur (middlewares, démarrage) et logique de routage métier.
- **Framework structuré (NestJS ou équivalent avec controllers/services/modules/injection de dépendances).** Rejeté pour la V0 : apporte une rigueur utile à plus grande échelle, mais une courbe d'apprentissage et des dépendances disproportionnées pour une API de démonstration à quelques routes.
- **Couche "controller" séparée des routes** (route → controller → service → store). Rejeté pour l'instant : ajoute une indirection sans bénéfice visible tant que la logique de chaque route reste un simple appel au store de données.

## Conséquences

**Ce qu'on gagne**

- Ajouter, retirer ou déplacer une ressource se fait en un seul endroit (`src/routes/<ressource>.js` + une ligne dans `server.js`).
- Chaque fichier de routes est court et ne concerne qu'une seule ressource.

**Ce qu'on accepte en échange**

- La logique métier et l'accès aux données vivent directement dans les fichiers de routes (ex. `tasks.js` appelle `taskStore` sans intermédiaire). Si cette logique grossit (validation, règles métier), elle n'a pas d'endroit dédié où aller et risque de s'accumuler dans les routes.
- Chaque nouveau routeur doit être monté manuellement dans `server.js` : il n'y a pas de découverte automatique des fichiers de routes. Un oubli de `app.use(...)` passerait silencieusement inaperçu (pas d'erreur au démarrage).
- Il n'y a pas d'endroit commun pour appliquer un middleware partagé par plusieurs ressources (ex. authentification) autrement que de le répéter dans chaque routeur.

## Quand revoir cette décision

Dès que l'un de ces besoins apparaît :

- la logique métier dans les routes devient trop complexe pour rester lisible dans de simples handlers Express ;
- plusieurs ressources doivent partager un même middleware (authentification, validation) de façon systématique ;
- le nombre de ressources rend le montage manuel dans `server.js` difficile à maintenir.

Il faudra alors introduire une couche service (et éventuellement controller) entre les routes et les stores, et documenter ce changement dans un nouvel ADR qui remplace celui-ci.
