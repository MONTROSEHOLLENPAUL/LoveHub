const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });
  const memories = db.memories.filter(m => m.coupleId === user.coupleId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(memories);
});

router.post('/', auth, (req, res) => {
  const { title, note, date, emoji } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const memory = {
    id: uuidv4(),
    coupleId: user.coupleId,
    title,
    note,
    date: date || new Date(),
    emoji: emoji || '💕',
    createdBy: req.user.name,
    createdAt: new Date()
  };
  db.memories.push(memory);
  res.status(201).json(memory);
});

router.delete('/:id', auth, (req, res) => {
  db.memories = db.memories.filter(m => m.id !== req.params.id);
  res.json({ success: true });
});

module.exports = router;
