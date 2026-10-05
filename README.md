# TaskFlow API

API de gestion de tâches permettant de consulter, créer, supprimer et exporter des tâches.

## Installation

Prérequis : Node.js et npm. À la racine du projet :

```bash
npm ci
npm start
```

L'installation et le démarrage sont réussis lorsque le terminal confirme que l'API écoute sur le port 3000.

## Utilisation

Une fois le serveur lancé, se rendre sur le lien suivant : 

```bash 
http://localhost:3000
```

## Architecture

`src/server.js` démarre l'API ; `src/routes/` contient les routes ; `src/data/taskStore.js` gère le stockage en mémoire ; `src/config.js` contient la configuration.

## Tests et sécurité

Aucun test automatisé n'est configuré (`package.json` ne définit pas de script de test). Les tâches disparaissent à l'arrêt du serveur. La clé d'administration est codée dans la configuration : ne la publiez pas et remplacez-la par une variable d'environnement avant tout déploiement.

## Contributions et licence

Nolann PIERRE-ANTOINE, Marie-Catalina GRENOT et Alexis LAUMONIER. Licence : `UNLICENSED` (aucune licence libre déclarée).
