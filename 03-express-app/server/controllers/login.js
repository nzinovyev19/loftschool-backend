const db = require('../model');
const { getAdminInfo } = db;

module.exports = {
  getLoginPage: (req, res) => {
    if (req.session.isAuth) {
      res.redirect('/admin');
    }
    res.render('pages/login', {
      title: 'Login',
      msglogin: req.flash('msglogin')[0]
    });
  },
  authorize: (req, res) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const { email: adminEmail, password: passwordAdmin } = getAdminInfo();
      if (adminEmail !== email || passwordAdmin !== password) {
        throw new Error('Ошибка');
      }
      req.session.isAuth = true;
      res.redirect('/admin');
    } catch (e) {
      req.flash('msglogin', 'Ошибка при авторизации');
    } finally {
      res.redirect('/login');
    }
  }
};
