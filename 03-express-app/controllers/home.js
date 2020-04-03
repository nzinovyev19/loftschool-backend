const db = require('../db');

exports.getSkills = () => new Promise((resolve, reject) => {
  try {
    const result = db.get('skills').value();
    resolve(result);
  } catch (e) {
    reject(e);
  }
});
