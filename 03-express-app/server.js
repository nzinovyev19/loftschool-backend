const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();

const homeController = require('./controllers/home');

app.set('views', path.join(__dirname, 'source/template'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const result = await homeController.getSkills();
    console.log(result);
    res.render('pages/home', {
      title: 'Home page',
      skills: result,
      products: []
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({
      message: e
    });
  }
});

app.get('/admin', (req, res) => {
  res.render('pages/admin', {
    title: 'Admin'
  });
});

app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login'
  });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.end('error', {
    message: err.message,
    error: err
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
