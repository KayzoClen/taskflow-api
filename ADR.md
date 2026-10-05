# ADR : Stockage de la clé administrateur dans une variable d'environnement

## Contexte

L'API TaskFlow possède une fonctionnalité d'export réservée à
l'administrateur.

Actuellement, la clé permettant d'accéder à cette fonctionnalité est
stockée directement dans le fichier `src/config.js`.

Cette configuration pose un problème de sécurité car la clé est écrite
en clair dans le code source et elle est donc versionnée dans le dépôt Git.

Nous devons donc trouver une manière de stocker cette information
sensible sans l'intégrer directement au code source.

## Décision proposée 

Nous décidons de déplacer la clé administrateur dans une variable
d'environnement.

La valeur sera définie dans un fichier `.env` en développement local
et le fichier `.env` sera ajouté au `.gitignore` afin qu'il ne soit pas
versionné dans le dépôt.

L'application récupérera ensuite la clé depuis les variables
d'environnement au démarrage du serveur.

Exemple :

```env
ADMIN_KEY=ma-cle-secrete
```

## Option 1 - Utiliser un fichier .env 

Avantages : 
- La clé n'est plus écrite dans la code 
- Le fichier .env peut etre exclu de Git avec le .gitignore 
- La modification de la clé ne nécessite pas de modifier le code 

Inconvénients : 
- Il faut configurer correctement le fichier .env 
- Il  faut penser à fournir les variables nécessaires lors du déploiement 


## Conséquences 

Conséquences positives : 
- La clé administrateur n'est plus directement présente dans le code.
- Le risque de publier accidentellement la clé dans Git est réduit.

Conséquences négatives : 
- Le projet nécessite une configuration supplémentaire lors de son
installation.
- Un fichier .env doit être créé localement.
- Une mauvaise configuration des variables d'environnement peut
empêcher l'API de fonctionner correctement.

## Status 

Accepté 


