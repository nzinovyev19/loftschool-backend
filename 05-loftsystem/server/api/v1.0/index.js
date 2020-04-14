const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth');
const newsController = require('../../controllers/news');

router.post('/registration', authController.registrate);

router.post('/login', authController.login);

router.get('/news', newsController.getNews);

module.exports = router;
