const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./config/db');
const socketCotnroller = require('./controllers/socket');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

io.on('connection', socketCotnroller);

app.use('/api', require(path.join(__dirname, 'api/v1.0')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

server.listen('3000', () => {
  console.log('Server listening on http://localhost:3000');
});
