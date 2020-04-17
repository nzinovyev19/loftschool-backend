const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newScheme = new Schema({
  id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    firstName: String,
    id: {
      type: String,
      required: true,
    },
    image: String,
    middleName: String,
    surName: String,
    username: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('new', newScheme);
