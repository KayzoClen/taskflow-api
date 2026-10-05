## Contexte
Les tâches de TaskFlow API sont stockées dans un tableau en mémoire (`src/data/taskStore.js`), sans base de données, et ce choix n'était documenté nulle part. Cette PR ajoute l'ADR-0001 qui l'explique.

## Changements
- Ajout de `docs/adr/0001-stockage-en-memoire.md` : contexte, 4 options comparées (mémoire, fichier JSON, SQLite, serveur de BDD), décision et conséquences.
- Ajout de `.github/pull_request_template.md`.
- Exclu : aucune modification du code.

## Impact
- Documentation uniquement.
- Pas de breaking change.
- Aucune action requise après le merge.
- Point de vigilance pour le relecteur : vérifier que le contexte et les options correspondent à la réalité du projet.

## Comment vérifier
1. Ouvrir l'ADR dans l'onglet « Files changed ».
2. Vérifier qu'il se comprend sans explication orale.
3. Remplir la grille de relecture ✅ / ⚠️ / ❌ en commentaire.

## Checklist
- [x] Documentation à jour
- [ ] Tests : non applicable
- [ ] Issue liée : non applicable
