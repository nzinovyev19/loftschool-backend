const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./server/model/db.json');
const db = low(adapter);

module.exports = {
  getAdminInfo: () => {
    try {
      const result = db.get('admin').value();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  getSkills: () => {
    try {
      const result = db.get('skills').value();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  getProducts: () => {
    try {
      const result = db.get('products').value();
      return result;
    } catch (e) {
      console.error(e);
    }
  },
  updateSkills: (skills) => {
    try {
      Object.entries(skills).forEach(([id, number]) => (
        db.get('skills')
          .find({ id })
          .assign({ number })
          .write()
      ));
    } catch (e) {

    }
  },
  setMessages: (message) => {
    try {
      db.get('messages')
        .push(message)
        .write();
    } catch (e) {
      console.error(e);
    }
  },
  createProduct: (product) => {
    console.log(product);
    try {
      db.get('products')
        .push(product)
        .write();
    } catch (e) {
      console.error(e);
    }
  }
};
