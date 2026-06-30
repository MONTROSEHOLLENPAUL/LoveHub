const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

// Get messages
router.get('/', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const msgs = db.messages.filter(m => m.coupleId === user.coupleId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  res.json(msgs);
});

// Send message
router.post('/', auth, (req, res) => {
  const { content, type = 'text' } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const msg = {
    id: uuidv4(),
    coupleId: user.coupleId,
    senderId: req.user.id,
    senderName: req.user.name,
    content,
    type,
    createdAt: new Date()
  };
  db.messages.push(msg);
  res.status(201).json(msg);
});

module.exports = router;
