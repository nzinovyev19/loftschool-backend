const User = require('../model/user');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jwt-simple');
const role = require('../helpers/role');
const { check, validationResult } = require('express-validator');

const tokenExpires = 86400000;

function genToken (user) {
  const token = jwt.encode({
    exp: tokenExpires,
    username: user.username,
  }, process.env.JWT_SECRET);

  return {
    token: 'JWT' + token,
    expires: tokenExpires,
    user: user.id,
  };
}

module.exports = {
  async registrate (req, res) {
    try {
      console.log(req.body);
      const user = new User({
        id: uuidv4(),
        permission: role.user,
        ...req.body,
      });
      await user.save();
      res.status(200).send({
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
        accessToken: genToken(user),
        accessTokenExpiredAt: tokenExpires,
      });
    } catch (e) {
      res.status(500).send('Server error');
    }
  },
  async login (req, res) {
    try {
      console.log('body', req.body);
      check('username', 'Invalid username').notEmpty();
      check('password', 'Invalid password').notEmpty();

      const errors = validationResult(req);
      console.log('validation', errors);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const user = await User.findOne({ username: req.body.username });
      console.log(user);
      if (user === null) throw Error('User not found');
      if (user.password !== req.body.password) throw Error('Not valid password or username');

      res.status(200).send({
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
        accessToken: genToken(user),
        accessTokenExpiredAt: tokenExpires,
      });
    } catch (e) {
      console.log(e);
      res.status(500).send(e.message);
    }
  },
};
