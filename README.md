# GetHeavy 👩‍🍳📞

> API qui te guide pas à pas dans une recette, comme si ta mère t'expliquait au téléphone.

Projet réalisé dans le cadre du module **Documentation technique et travail collaboratif**.

🚧 **Statut : en phase de conception.** Le code n'est pas encore écrit, ce document décrit ce que nous allons construire.

## Le concept

Quand on cuisine pour la première fois, on appelle souvent quelqu'un qui sait faire. Cette personne ne nous donne pas toute la recette d'un coup : elle vérifie d'abord qu'on a les ingrédients, puis elle explique **une étape à la fois** et attend qu'on ait fini avant de passer à la suite.

GetHeavy reproduit ce fonctionnement sous forme d'API :

1. L'utilisateur choisit une recette.
2. L'API lui rappelle les ingrédients nécessaires.
3. L'API donne la première étape.
4. Quand l'utilisateur a terminé, il demande l'étape suivante (ou peut revenir en arrière).
5. À la fin : « Bravo, bon appétit ! »

## Exemple

Voici à quoi ressemblera une étape renvoyée par l'API :

```json
{
  "recette": "Crêpes",
  "etape": 3,
  "total": 6,
  "message": "Maintenant tu ajoutes le lait petit à petit, sinon ça fait des grumeaux !"
}
```

## Fonctionnalités prévues

| Fonctionnalité | Route prévue | Statut |
|---|---|---|
| Voir la liste des recettes | `GET /recipes` | À faire |
| Voir le détail d'une recette | `GET /recipes/:id` | À faire |
| Voir les ingrédients à préparer | `GET /recipes/:id/ingredients` | À faire |
| Commencer une recette | `POST /cooking/start` | À faire |
| Voir l'étape en cours | `GET /cooking/:id/step` | À faire |
| Passer à l'étape suivante | `POST /cooking/:id/next` | À faire |
| Revenir à l'étape précédente | `POST /cooking/:id/previous` | À faire |

Pour commencer, l'API proposera 3 recettes simples : crêpes, omelette et pâtes carbonara.

## Choix techniques

- **Node.js + Express** : déjà utilisés dans le projet de base fourni.
- **Recettes stockées dans un fichier JSON** : simple à écrire et à lire, pas besoin de base de données pour un projet de cette taille.
- **Sessions de cuisine gardées en mémoire** : suffisant pour une première version (elles sont perdues au redémarrage du serveur).

## Organisation de l'équipe

| Membre | Responsabilités |
|---|---|
| Mohamed Aziz | Fichier des recettes, routes de cuisine guidée (`/cooking`), documentation de ces routes |
| Yanael | Routes des recettes (`/recipes`), règles de contribution, documentation de ces routes |

Le suivi des tâches se fait avec les **Issues GitHub**. Chaque modification est enregistrée par un commit avec un message clair (`feat:`, `fix:`, `docs:`).

## Installation

Prérequis : [Node.js](https://nodejs.org/) (version 18 ou plus) et [Git](https://git-scm.com/).

```bash
git clone https://github.com/KayzoClen/taskflow-api.git
cd taskflow-api
npm install
npm start
```

L'API est disponible sur `http://localhost:3000`.

## Auteurs

- Mohamed Aziz Bayoudh 
- Yanael Finnon