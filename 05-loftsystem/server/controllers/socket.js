const Dialog = require('../model/dialog');
const users = {};

function genDialogIdByCombineUserId (firstToken, secondToken) {
  return firstToken > secondToken ? firstToken + secondToken : secondToken + firstToken;
}

module.exports = (socket) => {
  socket.on('users:connect', ({ userId, username }) => {
    const defaultRoom = null;
    users[socket.id] = {
      userId: userId,
      socketId: socket.id,
      username: username,
      activeRoom: defaultRoom,
    };
    socket.join(defaultRoom);
    socket.emit('users:list', Object.entries(users).map(([socketId, socketIdValue]) => socketIdValue));
    socket.broadcast.to(defaultRoom).emit('users:add', users[socket.id]);
  });

  socket.on('message:add', async ({ senderId, recipientId, roomId, text }) => {
    const currentDialog = await Dialog.findOneAndUpdate({ id: genDialogIdByCombineUserId(senderId, recipientId) }, {
      $push: {
        messages: {
          text,
          senderId,
          recipientId,
        },
      },
    }, {
      useFindAndModify: false,
    });
    console.log(currentDialog);
    if (!currentDialog) {
      await Dialog.create({
        id: genDialogIdByCombineUserId(senderId, recipientId),
        messages: [
          {
            text,
            senderId,
            recipientId,
          },
        ],
      });
    }
    socket.json.emit('message:add', {
      text,
      senderId,
      recipientId,
    });
    socket.broadcast.to(roomId).json.emit('message:add', {
      text,
      senderId,
      recipientId,
    });
  });

  socket.on('message:history', async ({ recipientId, userId: senderId }) => {
    const dialog = await Dialog.findOne({ id: genDialogIdByCombineUserId(recipientId, senderId) });
    socket.json.emit('message:history', dialog ? dialog.messages : []);
  });

  socket.on('disconnect', (data) => {
    socket.broadcast.emit('users:leave', socket.id);
    delete users[socket.id];
  });
};
