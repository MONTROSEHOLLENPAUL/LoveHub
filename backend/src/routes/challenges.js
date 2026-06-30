const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  const couple = user?.coupleId ? db.couples.find(c => c.id === user.coupleId) : null;
  const completed = couple?.completedChallenges || [];
  const challenges = db.challenges.map(c => ({ ...c, completed: completed.includes(c.id) }));
  res.json(challenges);
});

router.post('/:id/complete', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const couple = db.couples.find(c => c.id === user.coupleId);
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ error: 'Défi non trouvé' });

  if (!couple.completedChallenges) couple.completedChallenges = [];
  if (!couple.completedChallenges.includes(challenge.id)) {
    couple.completedChallenges.push(challenge.id);
    couple.points = (couple.points || 0) + challenge.points;
  }
  res.json({ points: couple.points });
});

module.exports = router;
