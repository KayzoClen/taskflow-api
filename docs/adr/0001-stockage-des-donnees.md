# ADR 0001 : Stockage des recettes et des sessions de cuisine

- **Statut :** Proposé
- **Date :** 2026-10-05
- **Auteurs :** Yanael Fillon, Mohamed Aziz Bayoudh

## Contexte

GetHeavy est une API Node.js + Express qui guide l'utilisateur pas à pas dans une recette. Elle manipule deux types de données :

1. **Les recettes** : nom, ingrédients, liste ordonnée d'étapes. Ce sont des données de référence, écrites par l'équipe et qui changent rarement. La première version en contient 3 : crêpes, omelette et pâtes carbonara.
2. **Les sessions de cuisine** : elles indiquent quel utilisateur suit quelle recette et à quelle étape il en est. Elles sont créées par `POST /cooking/start`, puis modifiées par `next` et `previous`. Ce sont des données temporaires, qui changent à chaque requête.

Contraintes du projet :

- Projet de cours, réalisé par 2 personnes sur une durée courte.
- Le projet de base fourni (`taskflow-api`) stocke déjà ses données en mémoire (`src/data/taskStore.js`).
- L'API doit pouvoir s'installer avec un simple `npm install && npm start`, sans aucun service externe à configurer.
- Le volume de données est très faible (quelques recettes, quelques sessions à la fois).

## Options envisagées

### Option A : base de données (SQLite, PostgreSQL ou MongoDB)

- ✅ Les données sont conservées après un redémarrage, et on peut faire des requêtes avancées.
- ❌ Il faut une dépendance en plus, voire un serveur à installer, ainsi qu'un schéma et des migrations.
- ❌ C'est disproportionné pour 3 recettes, et l'installation devient plus compliquée pour les correcteurs et les contributeurs.

### Option B : recettes dans un fichier JSON, sessions en mémoire (retenue)

- ✅ Aucune dépendance supplémentaire, c'est cohérent avec le projet de base.
- ✅ Le fichier JSON est lisible et facile à modifier, et ajouter une recette passe par une Pull Request.
- ✅ Les recettes sont versionnées avec Git, donc chaque modification est relue.
- ❌ Les sessions de cuisine sont perdues à chaque redémarrage du serveur.
- ❌ L'API ne peut pas tourner sur plusieurs instances, car chaque instance aurait ses propres sessions.

### Option C : tout dans des fichiers JSON (sessions écrites sur disque)

- ✅ Les sessions sont conservées après un redémarrage.
- ❌ Il faut gérer les écritures concurrentes et les fichiers corrompus. Ça demande beaucoup de travail pour un bénéfice faible sur des données de courte durée.

## Décision

Nous retenons l'**option B** :

- Les recettes sont stockées dans un fichier JSON du dépôt (par exemple `src/data/recipes.json`), chargé **en lecture seule** au démarrage. L'API ne modifie jamais ce fichier.
- Les sessions de cuisine sont gardées **en mémoire** dans un module dédié (par exemple `src/data/sessionStore.js`), sur le même modèle que `taskStore.js`.
- Les routes ne manipulent jamais directement le fichier JSON ni l'objet en mémoire. Elles passent par les fonctions des modules `data/` (`getAll`, `getById`, `startSession`…). Ainsi, on pourra changer de méthode de stockage plus tard sans réécrire les routes.

## Conséquences

**Positives**

- L'installation et le démarrage sont immédiats, sans configuration.
- Le code reste simple à comprendre pour les deux membres de l'équipe.
- Les recettes passent par le même circuit de relecture que le code (Issues, PR, commits `feat:`).

**Négatives (acceptées)**

- Un redémarrage du serveur fait perdre les sessions en cours. Ce comportement doit être indiqué dans la documentation des routes `/cooking`.
- L'API n'est pas prête à tourner sur plusieurs instances.
- Les identifiants qui arrivent dans l'URL sont des chaînes de caractères. Il faut les convertir explicitement (`Number(id)`) et ne pas s'appuyer sur `==` comme le fait `taskStore.js`.

**Quand revoir cette décision**

Il faudra rouvrir cet ADR si l'un de ces besoins apparaît : conserver les sessions après un redémarrage, laisser les utilisateurs ajouter leurs propres recettes, gérer des comptes utilisateurs, ou déployer l'API sur plusieurs instances. Dans ce cas, SQLite sera la première option à étudier.
