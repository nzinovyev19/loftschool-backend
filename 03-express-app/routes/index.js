const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', async (req, res) => {
  try {
    const result = await homeController.getSkills();
    res.render('pages/home', { title: 'Home', skills: result });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: e
    });
  }
});

router.get('/admin', (req, res) => {
  res.render('pages/admin', { title: 'Admin' });
});

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login' });
});

module.exports = router;
