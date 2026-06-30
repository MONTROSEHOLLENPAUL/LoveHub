# LoveHub — L'écosystème numérique pour les couples modernes

## Structure du projet

```
lovehub/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── index.js         # Serveur principal
│   │   ├── db.js            # Base de données en mémoire
│   │   ├── middleware/
│   │   │   └── auth.js      # Middleware JWT
│   │   └── routes/
│   │       ├── auth.js      # Authentification
│   │       ├── couple.js    # Gestion du couple
│   │       ├── messages.js  # Chat
│   │       ├── expenses.js  # Dépenses partagées
│   │       ├── memories.js  # Journal de souvenirs
│   │       ├── dates.js     # Planificateur
│   │       └── challenges.js # Défis
│   └── package.json
│
└── frontend/         # Vue 3 + Vite
    ├── src/
    │   ├── main.js
    │   ├── App.vue
    │   ├── assets/main.css
    │   ├── router/index.js
    │   ├── stores/auth.js   # Pinia store
    │   └── views/
    │       ├── LoginView.vue
    │       ├── ConnectView.vue
    │       ├── HomeView.vue
    │       ├── ChatView.vue
    │       ├── PlanningView.vue
    │       ├── ExpensesView.vue
    │       ├── MemoriesView.vue
    │       └── ChallengesView.vue
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Installation & Démarrage

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev        # http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## 🔑 Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| **Authentification** | Inscription/connexion avec JWT |
| **Connexion couple** | Système de codes d'invitation |
| **Chat privé** | Messages en temps réel (polling 5s) |
| **Planificateur** | Dates, restaurants, voyages |
| **Dépenses** | Suivi des finances en couple (HTG) |
| **Souvenirs** | Journal de moments partagés |
| **Défis** | Activités pour renforcer la complicité |

## 🔮 Prochaines étapes (Production)

- Remplacer la DB en mémoire par **MongoDB** ou **PostgreSQL**
- Ajouter **Socket.io** pour le chat en temps réel
- Intégrer le **paiement** (300 HTG/mois)
- Ajouter les **notifications push**
- Déployer sur **Railway** (backend) + **Vercel** (frontend)

## 📡 API Endpoints

```
POST /api/auth/register
POST /api/auth/login

POST /api/couple/invite
POST /api/couple/join
GET  /api/couple/me
PUT  /api/couple/anniversary

GET  /api/messages
POST /api/messages

GET  /api/expenses
POST /api/expenses
DELETE /api/expenses/:id

GET  /api/memories
POST /api/memories
DELETE /api/memories/:id

GET  /api/dates
POST /api/dates
PUT  /api/dates/:id
DELETE /api/dates/:id

GET  /api/challenges
POST /api/challenges/:id/complete
```