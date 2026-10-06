# ADR 0001 : Stocker les tâches en mémoire pour la V0

- **Statut** : Accepté (documenté rétrospectivement le 05/10/2026)
- **Date de la décision** : 01/10/2026 (commit initial `0e13cce`)
- **Auteur** : Joseph Tsamga

## Contexte

TaskFlow API est une API REST de gestion de tâches (Node.js / Express) servant
de projet support. En V0, l'objectif est d'avoir rapidement une API
fonctionnelle (lister, consulter, créer, supprimer des tâches) que l'équipe
peut lancer avec un simple `npm start`, sans infrastructure à installer.

Le volume de données est faible (quelques tâches de démonstration) et il n'y
a pas encore d'exigence de persistance ni de déploiement multi-instances.
Le commentaire de `src/data/taskStore.js` qualifie d'ailleurs ce stockage de
« choix assumé pour la V0 », à rediscuter si le volume ou le besoin de
persistance évolue.

Ce qui atteste cette décision dans le dépôt :

- `package.json` ne déclare qu'une seule dépendance, Express : aucun pilote
  de base de données ni ORM.
- `src/routes/tasks.js` et `src/routes/admin.js` accèdent aux données
  uniquement via les fonctions de `src/data/taskStore.js`.
- `git log` montre que ce stockage existe depuis le commit initial `0e13cce`
  et n'a pas été modifié depuis.

## Options envisagées

1. **Tableau JavaScript en mémoire (retenue)**
   - \+ Zéro dépendance, zéro configuration, démarrage immédiat
   - \+ Code d'accès aux données trivial à lire
   - − Données perdues à chaque redémarrage
   - − Impossible de partager l'état entre plusieurs instances
2. **Fichier JSON sur disque**
   - \+ Persistance sans dépendance externe
   - − Gestion manuelle des écritures concurrentes et du risque de corruption
3. **SQLite**
   - \+ Vraie persistance, requêtes SQL, un seul fichier
   - − Dépendance native supplémentaire, schéma et migrations à gérer
4. **SGBD serveur (PostgreSQL, MongoDB)**
   - \+ Persistance robuste, adapté à la montée en charge
   - − Infrastructure à installer pour chaque développeur, surdimensionné en V0

## Décision

Les tâches sont stockées dans un tableau en mémoire, encapsulé dans le module
`src/data/taskStore.js`, qui expose une interface `getAll`, `getById`,
`create` et `remove`. Les routes n'accèdent aux données que via ce module.

Ce choix privilégie la simplicité et la rapidité de mise en place pour la V0,
au détriment de la persistance.

## Conséquences

### Positives

- Projet lançable en une commande, sans base de données.
- Accès aux données isolé dans un seul module : remplacer le stockage plus
  tard ne devrait toucher principalement que `taskStore.js`.

### Négatives

- Toutes les données créées sont perdues au redémarrage du serveur ;
  les identifiants repartent de la valeur initiale de `nextId`.
- Chaque instance du serveur possède son propre état : pas de scalabilité
  horizontale possible.
- Le paramètre `dataRetentionDays: 90` de `src/config.js` est inopérant avec
  ce stockage : il est incohérent avec la décision actuelle.
- L'interface du store est synchrone ; une vraie base de données imposera
  des appels asynchrones et donc une modification des routes qui l'utilisent.

### Critères de révision

Cette décision devra être revue (par un nouvel ADR qui remplacera celui-ci)
dès que :

- les données doivent survivre à un redémarrage ;
- l'API doit tourner sur plusieurs instances ;
- la politique de rétention de 90 jours doit réellement s'appliquer.
