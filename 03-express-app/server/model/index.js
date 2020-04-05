const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./server/model/db.json');
const db = low(adapter);

module.exports = {
  getAdminInfo: (resolve, reject) => {
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
  }
};
