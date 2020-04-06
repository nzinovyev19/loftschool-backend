const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./server/model/db.json');
const db = low(adapter);

module.exports.setMessages = (message) => {
  try {
    db.get('messages')
      .push(message)
      .write();
  } catch (e) {
    console.error(e);
  }
};
