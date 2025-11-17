# WildRent

# English Version

## Description

WildRent is a web application for renting outdoor equipment (skiing, hiking, diving, etc.).
It allows users to easily book equipment, while administrators can manage products and bookings via a dedicated back-office.

---

## Objective – MVP (Minimum Viable Product)

This first version of WildRent provides a complete outdoor equipment rental experience for both users and administrators.

### Administrator area

* Full product catalog management (CRUD)
* Booking and user management
* Stock and availability administration

### Authenticated user

* Browse the product catalog with detailed information
* Search for available equipment by name or date range
* Manage shopping cart and place orders
* Simulated payment and PDF invoice generation
* Access to order history and user profile

### Non-authenticated user

* Limited access to product catalog and search
* Ability to create an account and log in to access full functionality

---

## Main features

* User authentication and session management
* Filterable and searchable product catalog
* Dynamic shopping cart with quantity management
* Simulated payment and PDF invoice generation
* Admin back-office (products, bookings, users)
* GraphQL API for front/back communication
* Containerized architecture with Docker (frontend, backend, database, cache, and Nginx)

---

## Technologies used

### Front-end

* React 19, TypeScript, Vite, ESLint, Apollo Client

### Back-end

* TypeScript, Express, TypeORM, GraphQL (Apollo Server), PostgreSQL, Argon2 + JWT, dotenv

### Tools & environment

* Docker & Docker Compose, npm, Jest / Vitest (tests planned), Nginx

---

## Installation and execution

### 1. Clone the project

```bash
git clone https://github.com/WildCodeSchool/2025-03-wns-green-WildRent.git
cd 2025-03-wns-green-WildRent
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file at the root of the project based on the `.env.example` template.

### 4. Run the application with Docker

```bash
npm run docker-up
```

The application will be available at:

### 5. Stop the application

```bash
npm run docker-down
```

---

## Tests

No tests have been implemented yet.

---

## Development best practices

### Git Workflow and branch conventions

* Main branches: `main` (production), `develop` (development)
* Working branches:

| Branch type | Example name                 | Purpose                            |
| ----------- | ---------------------------- | ---------------------------------- |
| feature     | `feature/cart-management`    | New feature                        |
| fix         | `fix/login-error`            | Bug fix                            |
| hotfix      | `hotfix/payment-crash`       | Urgent fix in production           |
| docs        | `docs/update-readme`         | Documentation updates              |
| chore       | `chore/add-dependency-axios` | Maintenance or dependency addition |

* Use **kebab-case** for all branch names.
* Create branches from `develop` (except `hotfix` from `main`).
* **Before merging into `develop`**: in local, update your `develop` branch, merge it into your working branch, check for conflicts, then push and create the Pull Request.

---

### Commit convention

Format:

```
type(scope): clear and concise title
```

Accepted types:

* build: build system
* ci: continuous integration
* docs: documentation
* feat: new feature
* fix: bug fix
* perf: performance improvement
* refactor: code changes without altering behavior
* style: code style changes (no logic change)
* test: adding or modifying tests
* chore: maintenance or configuration

**Scope**: indicates which part of the project is affected (e.g. `auth`, `api`, `cart`).

#### Example

```
feat(auth): implement JWT authentication and token refresh (WIP)
- Added login endpoint with JWT token generation
- Implemented refresh token mechanism
- Updated user model to store token info
- Work in progress: still need token revocation
```

* **Title**: type + scope + short description
* **Description**: bullet points explaining what was done and why
* **Work in progress**: add “(WIP)” if the task is not yet complete (either in the title or the description)

---

### Code style

* Use clear and explicit variable and function names (e.g. `calculateTotalPrice()` instead of `calc()`)
* Follow ESLint / Prettier standards
* Code review is mandatory before merging into `develop`

---


# Version française

## Description

WildRent est une application web de location de matériel outdoor (ski, randonnée, plongée, etc.).
Elle permet aux utilisateurs de réserver facilement du matériel et à l’administrateur de gérer les produits et les réservations via un back-office.

---

## Objectif – MVP (Minimum Viable Product)

Cette première version de WildRent offre une expérience complète de location de matériel outdoor pour les utilisateurs et les administrateurs.

### Espace administrateur

* Gestion complète du catalogue produits (CRUD)
* Suivi des réservations et des utilisateurs
* Administration du stock et des disponibilités

### Utilisateur connecté

* Consultation du catalogue et des détails produits
* Recherche de matériel disponible par nom ou par dates
* Gestion du panier et passage de commande
* Paiement fictif et génération de facture PDF
* Accès à l’historique des commandes et au profil utilisateur

### Utilisateur non connecté

* Accès limité au catalogue et à la recherche
* Possibilité de créer un compte et de se connecter pour accéder aux fonctionnalités complètes

---

## Fonctionnalités principales

* Authentification et gestion des sessions utilisateurs
* Catalogue de produits filtrable et consultable par dates
* Panier dynamique avec gestion des quantités
* Simulation de paiement et génération de factures PDF
* Back-office d’administration (produits, réservations, utilisateurs)
* API GraphQL pour les échanges front/back
* Architecture conteneurisée avec Docker (frontend, backend, base de données, cache et Nginx)

---

## Technologies utilisées

### Front-end

* React 19, TypeScript, Vite, ESLint, Apollo Client

### Back-end

* TypeScript, Express, TypeORM, GraphQL (Apollo Server), PostgreSQL, Argon2 + JWT, dotenv

### Outils & environnement

* Docker & Docker Compose, npm, Jest / Vitest (tests à venir), Nginx

---

## Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/WildCodeSchool/2025-03-wns-green-WildRent.git
cd 2025-03-wns-green-WildRent
```

### 2. Installer les dépendances

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configurer les variables d’environnement

Créer un fichier `.env` à la racine du projet en vous basant sur le modèle `.env.example`.


### 4. Lancer l’application avec Docker

```bash
npm run docker-up
```

L’application sera accessible sur :

### 5. Arrêter l’application

```bash
npm run docker-down
```

---

## Tests

Aucun test n’est encore implémenté pour le moment.

---

## Bonnes pratiques de développement

### Git Workflow et conventions de branches

* Branches principales : `main` (production), `develop` (développement)
* Branches de travail :

| Type de branche | Exemple de nom               | Usage                                       |
| --------------- | ---------------------------- | ------------------------------------------- |
| feature         | `feature/cart-management`    | Nouvelle fonctionnalité                     |
| fix             | `fix/login-error`            | Correction de bug                           |
| hotfix          | `hotfix/payment-crash`       | Correctif urgent en production              |
| docs            | `docs/update-readme`         | Modification ou ajout de documentation      |
| chore           | `chore/add-dependency-axios` | Tâche de maintenance ou ajout de dépendance |

* Utiliser **kebab-case** pour les noms de branches.
* Créer les branches depuis `develop` (sauf hotfix depuis `main`).
* **Avant de merger sur `develop`** : en local, mettre à jour votre branche `develop`, merger `develop` sur votre branche de travail, vérifier qu’il n’y a pas de conflits, puis pousser et créer la Pull Request.

### Convention de commits

Format :

```
type(scope): titre clair
```

Types possibles :

* build : système de build
* ci : intégration continue
* docs : documentation
* feat : nouvelle fonctionnalité
* fix : correction de bogue
* perf : amélioration des performances
* refactor : modification du code sans changer le comportement
* style : modification du style du code
* test : ajout ou modification de tests
* chore : maintenance ou configuration

**Scope** : indique la partie du projet concernée (ex. `auth`, `api`, `cart`).

#### Exemple

```
feat(auth): implement JWT authentication and token refresh (WIP)
- Added login endpoint with JWT token generation
- Implemented refresh token mechanism
- Updated user model to store token info
- Work in progress: still need token revocation
```

* **Titre** : type + scope + courte description
* **Description** : tirets détaillant ce qui a été fait et pourquoi
* **Work in progress** : à ajouter si la tâche n’est pas terminée ou/et dans le titre avec (WIP)

### Code

* Noms de variables et fonctions clairs et explicites (ex. `calculateTotalPrice()` plutôt que `calc()`)
* Respect des standards ESLint / Prettier
* Revue de code obligatoire avant fusion sur `develop`
