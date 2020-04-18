const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dialogSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  messages: [
    {
      text: {
        type: String,
        required: true,
      },
      senderId: {
        type: String,
        required: true,
      },
      recipientId: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('dialog', dialogSchema);
