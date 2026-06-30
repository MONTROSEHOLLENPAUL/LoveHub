const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });
  const dates = db.dates.filter(d => d.coupleId === user.coupleId)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  res.json(dates);
});

router.post('/', auth, (req, res) => {
  const { title, location, scheduledAt, notes, type } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const date = {
    id: uuidv4(),
    coupleId: user.coupleId,
    title,
    location,
    scheduledAt,
    notes,
    type: type || 'sortie',
    createdBy: req.user.name,
    status: 'prévu',
    createdAt: new Date()
  };
  db.dates.push(date);
  res.status(201).json(date);
});

router.put('/:id', auth, (req, res) => {
  const date = db.dates.find(d => d.id === req.params.id);
  if (!date) return res.status(404).json({ error: 'Non trouvé' });
  Object.assign(date, req.body);
  res.json(date);
});

router.delete('/:id', auth, (req, res) => {
  db.dates = db.dates.filter(d => d.id !== req.params.id);
  res.json({ success: true });
});

module.exports = router;
