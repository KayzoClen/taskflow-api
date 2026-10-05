## Contexte

Closes #12.

Le titre d'une tâche pouvait provoquer une erreur lors de sa création
dans certaines conditions.

## Changements

- Correction de la validation du titre
- Ajout de tests pour le cas problématique
- Mise à jour de la documentation si nécessaire

## Impact

- Le comportement incorrect est corrigé
- Les cas valides continuent de fonctionner normalement
- Aucun changement de base de données

## Vérification

```bash
pytest