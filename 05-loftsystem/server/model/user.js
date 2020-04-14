const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
  username: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  permission: Object.fromEntries(['chat', 'news', 'settings'].map(field => (
    [field, Object.fromEntries(
      ['C', 'R', 'U', 'D'].map(ability => [ability, { type: Boolean, required: true }])
    )]
  ))),
  image: String,
  surName: String,
  firstName: String,
  middleName: String,
  password: {
    type: String,
    reuired: true,
  },
});

module.exports = mongoose.model('users', userScheme);
