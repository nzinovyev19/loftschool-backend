const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const db = require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.all('*', (req, res, next) => {
  if (req.path.includes('login')) return next();
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'accessToken') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return next();
  } catch (e) {
    console.log(e);
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token expired' });
    } else if (e instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ message: 'Invalid token' });
    }
  }
});

app.use('/api', require(path.join(__dirname, 'api/v1.0')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen('3000', () => {
  console.log('Server listening on http://localhost:3000');
});
