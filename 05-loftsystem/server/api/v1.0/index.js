const express = require('express');
const multer = require('multer');
const router = express.Router();
const jwt = require('jsonwebtoken');
const upload = multer({ dest: './build/assets/img' });
const authController = require('../../controllers/auth');
const newsController = require('../../controllers/news');
const usersController = require('../../controllers/users');
const profileController = require('../../controllers/profile');

router.all('*', (req, res, next) => {
  if (['login', 'refresh-token', 'registration'].find((path) => req.path.includes(path))) return next();
  const token = req.get('Authorization');
  if (!token) {
    return res.status(401).send('Token not provided');
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'accessToken') {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
    res.locals.userId = payload.userId;
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        message: 'Token expired',
      });
    } else if (e instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }
  }
});

router.post('/registration', authController.registrate);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshTokens);

router.get('/profile', profileController.getProfile);

router.patch('/profile', upload.single('avatar'), profileController.setProfile);

router.get('/news', newsController.getNews);

router.post('/news', newsController.createNews);

router.patch('/news/:id', newsController.setNews);

router.delete('/news/:id', newsController.deleteNews);

router.get('/users', usersController.getUsers);

router.patch('/users/:id/permission', usersController.setUserPermission);

router.delete('/users/:id', usersController.deleteUser);

module.exports = router;
