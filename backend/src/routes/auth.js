const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis' });

    if (db.users.find(u => u.email === email))
      return res.status(400).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashedPassword, avatar: null, coupleId: null, createdAt: new Date() };
    db.users.push(user);

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'lovehub_secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, coupleId: user.coupleId } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Identifiants incorrects' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'lovehub_secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, coupleId: user.coupleId } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
