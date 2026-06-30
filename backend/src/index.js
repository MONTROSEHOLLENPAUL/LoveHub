require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/couple', require('./routes/couple'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/memories', require('./routes/memories'));
app.use('/api/dates', require('./routes/dates'));
app.use('/api/challenges', require('./routes/challenges'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'LoveHub API' }));

app.listen(PORT, () => {
  console.log(`LoveHub App http://localhost:${PORT}`);
});