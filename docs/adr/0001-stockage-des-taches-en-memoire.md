# ADR 0001 : Stockage des tâches en mémoire

- **Statut :** Acceptée pour la V0
- **Date :** 5 octobre 2026

## Contexte

TaskFlow API doit permettre de consulter, créer, supprimer et exporter des tâches. La version actuelle est une V0 destinée à valider ces parcours avec une API Express. Le projet ne définit ni base de données, ni service de stockage externe, ni configuration d’accès à un tel service. Les tâches de départ sont définies dans `src/data/taskStore.js` et les routes délèguent à ce module.

Cette portée rend le stockage mémoire facile à mettre en place, mais implique que toutes les données créées pendant l’exécution sont perdues à l’arrêt ou au redémarrage du processus. Le stockage n’est pas partagé entre plusieurs instances de l’API. Le README signale déjà cette perte de données.

## Décision

Pour la V0, les tâches sont conservées dans un tableau en mémoire, encapsulé dans `src/data/taskStore.js`. Les routes utilisent les fonctions de ce module (`getAll`, `getById`, `create` et `remove`) au lieu de manipuler directement le tableau.

Les options envisagées sont :

- **Une base de données relationnelle** (par exemple PostgreSQL) : persistance durable et partage entre instances, au prix d’un service à installer, d’un schéma et d’une configuration supplémentaires.
- **Une base embarquée ou un fichier local** : persistance sans serveur de base de données séparé, mais gestion supplémentaire des écritures, des migrations et des accès concurrents.
- **Un tableau en mémoire** : mise en place immédiate, sans dépendance de stockage ni configuration supplémentaire ; les données restent temporaires et propres à chaque processus.

Le tableau mémoire est retenu car la V0 privilégie la simplicité pour valider les opérations de base. Le découpage dans un module dédié garde les routes indépendantes du détail de stockage et permet de remplacer cette implémentation lorsque le besoin de persistance sera établi.

## Conséquences

### Positives

- Le démarrage ne dépend d’aucun service de base de données et l’installation reste limitée à Node.js et npm.
- Le code de stockage est petit et les routes passent par une interface centralisée.
- La V0 peut être exécutée et démontrée sans configurer d’infrastructure supplémentaire.

### Négatives et limites

- Les créations et suppressions ne survivent pas à un redémarrage : le stockage actuel ne convient pas à des données que l’on doit conserver.
- Deux processus de l’API auraient chacun leur propre liste de tâches, avec des résultats potentiellement différents.
- Aucune transaction, sauvegarde ou politique réelle de rétention n’est assurée par ce tableau.

### Réexamen

Réexaminer cette décision dès qu’une démonstration doit conserver ses données entre redémarrages, que plusieurs instances doivent partager les tâches ou que les données deviennent importantes. Choisir alors un stockage persistant et documenter sa configuration et ses migrations dans un nouvel ADR ou une révision de celui-ci.
