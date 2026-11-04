# Portfolio

Portfolio personnel réalisé avec Express, HTML, CSS et JavaScript. Le formulaire de contact envoie ses messages par SMTP.

## Prérequis

- Node.js 18 ou supérieur
- Un compte de messagerie avec accès SMTP si le formulaire de contact doit être actif

## Installation

```bash
npm install
cp .env.example .env
```

Renseignez les paramètres SMTP et l'adresse de réception dans `.env` :

| Variable | Description |
| --- | --- |
| `PORT` | Port HTTP du serveur (3000 par défaut) |
| `SMTP_HOST` | Nom d'hôte du serveur SMTP |
| `SMTP_PORT` | Port SMTP (465 par défaut) |
| `SMTP_SECURE` | `true` pour une connexion TLS directe, `false` pour STARTTLS |
| `SMTP_USER` | Identifiant du compte SMTP |
| `SMTP_PASS` | Mot de passe ou mot de passe d'application SMTP |
| `MAIL_TO` | Adresse qui reçoit les messages du formulaire |

Lancez le serveur :

```bash
npm start
```

Ouvrez ensuite <http://localhost:3000> (ou le port défini dans `PORT`).

## Licence

Ce projet est sous licence [GNU General Public License v3.0](./LICENSE).

## Projet archivé