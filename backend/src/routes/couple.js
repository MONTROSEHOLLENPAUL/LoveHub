const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// Create couple invite
router.post('/invite', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const invite = { id: uuidv4(), code, creatorId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) };
  if (!db.invites) db.invites = [];
  db.invites.push(invite);
  res.json({ code });
});

// Join couple
router.post('/join', auth, (req, res) => {
  const { code } = req.body;
  if (!db.invites) return res.status(404).json({ error: 'Code invalide' });

  const invite = db.invites.find(i => i.code === code && new Date(i.expiresAt) > new Date());
  if (!invite) return res.status(404).json({ error: 'Code invalide ou expiré' });
  if (invite.creatorId === req.user.id) return res.status(400).json({ error: 'Vous ne pouvez pas rejoindre votre propre invitation' });

  const couple = {
    id: uuidv4(),
    partner1Id: invite.creatorId,
    partner2Id: req.user.id,
    anniversary: null,
    points: 0,
    createdAt: new Date()
  };
  db.couples.push(couple);

  // Update both users
  const u1 = db.users.find(u => u.id === invite.creatorId);
  const u2 = db.users.find(u => u.id === req.user.id);
  if (u1) u1.coupleId = couple.id;
  if (u2) u2.coupleId = couple.id;

  db.invites = db.invites.filter(i => i.code !== code);
  res.json({ couple, partner: { id: u1.id, name: u1.name, email: u1.email } });
});

// Get couple info
router.get('/me', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const couple = db.couples.find(c => c.id === user.coupleId);
  if (!couple) return res.status(404).json({ error: 'Couple non trouvé' });

  const partnerId = couple.partner1Id === req.user.id ? couple.partner2Id : couple.partner1Id;
  const partner = db.users.find(u => u.id === partnerId);

  res.json({ couple, partner: partner ? { id: partner.id, name: partner.name, email: partner.email } : null });
});

// Update anniversary
router.put('/anniversary', auth, (req, res) => {
  const { date } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const couple = db.couples.find(c => c.id === user.coupleId);
  if (couple) couple.anniversary = date;
  res.json({ anniversary: date });
});

module.exports = router;
