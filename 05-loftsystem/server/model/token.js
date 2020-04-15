const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  tokenId: String,
  userId: String,
});

module.exports = mongoose.model('tokens', tokenSchema);
