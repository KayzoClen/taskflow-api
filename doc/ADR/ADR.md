ADR 1 — Node.js / Express

Contexte :
Nous devons créer une API REST simple pour gérer les tâches.

Décision :
Utiliser Node.js avec Express.

Conséquence :
Le développement de l'API est simple et rapide, mais le projet dépend de l'écosystème Node.js.

---

ADR 2 — Stockage en mémoire

Contexte :
Le projet doit stocker les tâches sans ajouter de complexité.

Décision :
Stocker les tâches dans un tableau en mémoire.

Conséquence :
Le stockage est simple, mais les données sont perdues au redémarrage du serveur.

---

ADR 3 — Séparation des responsabilités

Contexte :
Le projet contient plusieurs fonctionnalités qui doivent rester organisées.

Décision :
Séparer les routes, la configuration et la gestion des données dans différents fichiers.

Conséquence :
Le projet est plus lisible et plus facile à maintenir.