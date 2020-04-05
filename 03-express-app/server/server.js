const path = require('path');
const flash = require('connect-flash');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();

const homeController = require('./controllers/home');
const loginController = require('./controllers/login');

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    return next();
  }
  res.redirect('/login');
};

app.set('views', path.join(__dirname, '../source/template'));
app.set('view engine', 'pug');

app.use(cookieParser('secret key'));
app.use(session({
  resave: false,
  secret: 'secret',
  cookie: { maxAge: 3600 * 24 },
  saveUninitialized: false
}));
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', homeController.getHomePage);

app.post('/', homeController.sendMessage);

app.get('/admin', isAuth, (req, res) => {
  res.render('pages/admin', {
    title: 'Admin'
  });
});

app.get('/login', loginController.getLoginPage);

app.post('/login', loginController.authorize);

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
