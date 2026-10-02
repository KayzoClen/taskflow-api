# TaskFlow API

API REST de gestion de tâches (Node.js + Express), avec un export réservé à l'administrateur.

## Prérequis

- [Node.js](https://nodejs.org) version `<18 ou supérieure>`
- npm version `<9 ou supérieure>`
- Git

Vérifier ses versions :
```bash
node -v
npm -v
```

## Installation


1. Cloner le dépôt
```bash
git clone <url-du-depot>
```
2. Aller dans le dossier de l'API
```bash
cd TravauxCollab/taskflow-api
```
3. Installer les dépendances
```bash
npm install
```
4. Lancer le serveur
```bash
npm start 
```

Résultat attendu dans le terminal :
```
TaskFlow API en ecoute sur le port 3000
```

L'API est alors disponible sur http://localhost:3000


## Bug

- La clé admin est écrite en clair dans `src/config.js` et versionnée
  dans le dépôt. 
  Piste d'amélioration : la déplacer dans un fichier `.env`
  (ajouté au `.gitignore`).

## Licence et Contact 

- **Licence :** `aucune`
- **Contact :** `Orlando, Rémi, Lilou et Enzo`
