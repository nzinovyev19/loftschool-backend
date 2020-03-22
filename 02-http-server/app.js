const express = require('express');
require('dotenv').config();
const app = express();

const interval = Number(process.env.INTERVAL);
const duration = Number(process.env.DURATION);

app.get('/', (req, res) => {
  res.send('Hello from Express');
});

app.get('/date', (req, res) => {
  if (interval > duration) {
    throw new Error('Интервал не должен быть больше, чем время выполнения');
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  const tickId = setInterval(() => {
    res.write(`Hello, ${(new Date()).toUTCString()}\n`);
  }, interval || 5000);
  setTimeout(() => {
    clearInterval(tickId);
    res.write(`End: ${(new Date()).toUTCString()}\n`);
    res.end();
  }, duration || 20000);
});

app.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server running on http://localhost:3000');
});
