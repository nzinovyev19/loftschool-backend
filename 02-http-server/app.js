const express = require('express');
require('dotenv').config();
const app = express();

const connections = [];
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
  connections.push(res);
  setTimeout(() => {
    res.send((new Date()).toUTCString());
    connections.shift();
  }, duration);
});

setInterval(() => {
  // Logs for every reqest
}, interval);

app.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server running on http://localhost:3000');
});
