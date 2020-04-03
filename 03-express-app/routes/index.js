const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index');

router.get('/', async (req, res) => {
  try {
    const result = await indexController.getSkills();
    console.log(result);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.render('pages/index', { title: 'Home' });
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
