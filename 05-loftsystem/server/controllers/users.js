const User = require('../model/user');

async function getUsers (req, res) {
  try {
    const users = await User.find().select('-password -_id -__v');
    res.status(200).json(users);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function setUserPermission (req, res) {
  try {
    const user = await User.findOne({ id: res.locals.userId });
    if (!user.permission.settings.U) {
      res.sendStatus(403);
    }
    await User.updateOne({ id: req.params.id }, {
      permission: req.body.permission,
    });
    getUsers(req, res);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

async function deleteUser (req, res) {
  try {
    const user = await User.findOne({ id: res.locals.userId });
    if (!user.permission.settings.D) {
      res.sendStatus(403);
    }
    await User.deleteOne({ id: req.params.id });
    getUsers(req, res);
  } catch (e) {
    res.status(400).send(e.message);
  }
}

module.exports = {
  getUsers,
  deleteUser,
  setUserPermission,
};
