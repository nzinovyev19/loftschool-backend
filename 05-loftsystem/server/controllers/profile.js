const fs = require('fs');
const path = require('path');

const User = require('../model/user');

module.exports = {
  async getProfile (req, res) {
    try {
      const user = await User.findOne({ id: res.locals.userId });
      res.status(200).send({
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  async setProfile (req, res) {
    try {
      const {
        firstName,
        middleName,
        surName,
        oldPassword,
        newPassword,
      } = req.body;
      const user = await User.findOne({ id: res.locals.userId });
      if (oldPassword && oldPassword !== user.password) {
        res.status(400).json({
          message: 'wrong password',
        });
      }
      const update = {
        surName,
        firstName,
        middleName,
      };
      if (req.file) {
        const { path: fileNamePath, originalname } = req.file;
        fs.renameSync(fileNamePath, path.join(process.cwd(), 'build/assets/img/', originalname));
        update.image = `./assets/img/${originalname}`;
      }
      if (newPassword.length) {
        update.password = newPassword;
      }
      await User.updateOne({ id: res.locals.userId }, update);
      res.status(200).json({
        id: user.id,
        username: user.username,
        permission: user.permission,
        image: update.image,
        surName: update.surName,
        firstName: update.surName,
        middleName: update.middleName,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
};
