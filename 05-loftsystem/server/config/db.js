const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.Promise = global.Promise;

mongoose.connect(`mongodb+srv://nikkit:${process.env.MONGO_PASSWORD}@cluster0-nfodz.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connect db');
});
