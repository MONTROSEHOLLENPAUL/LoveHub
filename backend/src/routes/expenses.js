const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });
  const expenses = db.expenses.filter(e => e.coupleId === user.coupleId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(expenses);
});

router.post('/', auth, (req, res) => {
  const { title, amount, category, paidBy } = req.body;
  const user = db.users.find(u => u.id === req.user.id);
  if (!user?.coupleId) return res.status(404).json({ error: 'Pas de couple' });

  const expense = {
    id: uuidv4(),
    coupleId: user.coupleId,
    title,
    amount: parseFloat(amount),
    category: category || 'autre',
    paidBy: paidBy || req.user.id,
    paidByName: req.user.name,
    createdAt: new Date()
  };
  db.expenses.push(expense);
  res.status(201).json(expense);
});

router.delete('/:id', auth, (req, res) => {
  db.expenses = db.expenses.filter(e => e.id !== req.params.id);
  res.json({ success: true });
});

module.exports = router;
