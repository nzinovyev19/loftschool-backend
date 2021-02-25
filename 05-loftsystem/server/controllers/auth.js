const User = require('../model/user');
const Token = require('../model/token');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const role = require('../helpers/role');
const { check, validationResult } = require('express-validator');

function genAccessToken (userId) {
  const payload = {
    type: 'accessToken',
    userId: userId,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: Number(process.env.JWT_ACCESS_EXPIRES) });
}

function genRefreshToken () {
  const payload = {
    id: uuidv4(),
    type: 'refreshToken',
  };
  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: Number(process.env.JWT_REFRESH_EXPIRES) }),
  };
}

function replaceDbRefreshToken (tokenId, userId) {
  return Token.findOneAndDelete({ userId })
    .exec()
    .then(() => Token.create({ tokenId, userId }));
}

function updateTokens (userId) {
  const accessToken = genAccessToken(userId);
  const refreshToken = genRefreshToken();

  return replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      accessTokenExpiredAt: Date.now() + process.env.JWT_ACCESS_EXPIRES * 1000,
      refreshToken: refreshToken.token,
      refreshTokenExpiredAt: Date.now() + process.env.JWT_REFRESH_EXPIRES * 1000,
    }));
}

module.exports = {
  async registrate (req, res) {
    try {
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
        ...updateTokens(user.id),
      });
    } catch (e) {
      res.status(500).send('Server error');
    }
  },
  async login (req, res) {
    try {
      check('username', 'Invalid username').notEmpty();
      check('password', 'Invalid password').notEmpty();

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const user = await User.findOne({ username: req.body.username });
      if (user === null) {
        res.status(400).json({ message: 'User not found' });
      }
      if (user.password !== req.body.password) {
        res.status(400).json({ message: 'Not valid password or username' });
      }

      const tokens = await updateTokens(user.id);

      res.status(200).send({
        firstName: user.firstName,
        id: user.id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
        ...tokens,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  },
  async refreshTokens (req, res) {
    const refreshToken = req.get('Authorization');
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      if (payload.type !== 'refreshToken') {
        return res.status(400).json({ message: 'Invalid token' });
      }
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ message: 'Token expired' });
      } else if (e instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ message: 'Invalid token' });
      }
    }
    Token.findOne({ tokenId: payload.id })
      .exec()
      .then((token) => {
        if (token === null) {
          throw new Error('Invalid token');
        }
        return updateTokens(token.userId);
      })
      .then(tokens => {
        res.append('Authorization', tokens.refreshToken);
        return res.json(tokens);
      })
      .catch(err => {
        res.status(400).json({ message: err.message });
      });
  },
};
