const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const db = {
  users: [],
  couples: [],
  messages: [],
  memories: [],
  expenses: [],
  dates: [],
  challenges: [],
  notifications: []
};


db.challenges = [
  { id: uuidv4(), title: "Lettre d'amour", description: "Écrivez-vous une lettre d'amour sincère à l'autre", category: "romance", points: 50 },
  { id: uuidv4(), title: "Cuisine ensemble", description: "Préparez un repas gastronomique ensemble", category: "activité", points: 40 },
  { id: uuidv4(), title: "Soirée sans téléphone", description: "Passez une soirée entière sans téléphone", category: "connexion", points: 60 },
  { id: uuidv4(), title: "Danse surprise", description: "Apprenez une danse ensemble en 30 minutes", category: "fun", points: 45 },
  { id: uuidv4(), title: "Voyage imaginaire", description: "Planifiez ensemble votre voyage de rêve", category: "rêve", points: 35 },
  { id: uuidv4(), title: "Massage romantique", description: "Offrez-vous mutuellement un massage de 20 minutes", category: "bien-être", points: 55 }
];

module.exports = db;