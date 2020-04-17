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

module.exports.getAdminInfo = () => {
  try {
    return db.get('admin')
      .value();
  } catch (e) {
    console.error(e);
  }
};

module.exports.getSkills = () => {
  try {
    return db.get('skills')
      .value();
  } catch (e) {
    console.error(e);
  }
};

module.exports.getProducts = () => {
  try {
    return db.get('products')
      .value();
  } catch (e) {
    console.error(e);
  }
};

module.exports.setSkills = (skills) => {
  try {
    Object.entries(skills).forEach(([id, number]) => (
      db.get('skills')
        .find({ id })
        .assign({ number })
        .write()
    ));
  } catch (e) {
    console.error(e);
  }
};

module.exports.addProduct = (product) => {
  try {
    db.get('products')
      .push(product)
      .write();
  } catch (e) {
    console.error(e);
  }
};
