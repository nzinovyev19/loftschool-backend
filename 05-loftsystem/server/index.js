const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./config/db');

const users = {};

io.on('connection', (socket) => {
  socket.on('users:connect', (userId, username) => {
    users[socket.id] = {
      userId: userId,
      socketId: socket.id,
      username: username,
      activeRoom: null,
    };
    socket.emit('users:list', Object.entries(users).map(([socketId, socketIdValue]) => socketIdValue));
    socket.broadcast.emit('users:add', users[socket.id]);
  });

  socket.on('message:add', ({ senderId, recipientId, roomId, text }) => {
    // socket.json.emit('message:add', {
    //   text,
    //   senderId,
    //   recipientId,
    // });
  });

  socket.on('message:history', ({ recipientId, userId }) => {
    // socket.json.emit('message:history', {
    //   userId,
    //   recipientId,
    // });
  });

  socket.on('disconnect', (data) => {
    const room = users[socket.id].activeRoom;
    socket.leave(room);
    socket.emit('users:leave', socket.id);
    delete users[socket.id];
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

app.use('/api', require(path.join(__dirname, 'api/v1.0')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

server.listen('3000', () => {
  console.log('Server listening on http://localhost:3000');
});
