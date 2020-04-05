const db = require('../model');
const { getAdminInfo } = db;

module.exports = {
  getLoginPage: (req, res) => {
    res.render('pages/login', {
      title: 'Login',
      msglogin: req.flash('msglogin')
    });
  },
  authorize: (req, res) => {
    try {
      const { email, password } = req.body;
      if (getAdminInfo.email !== email || getAdminInfo.password !== password) {
        throw new Error('Ошибка');
      }
      req.flash('msglogin', 'Форма обработана');
    } catch (e) {
      req.flash('msglogin', 'Ошибка при авторизации');
    } finally {
      console.log(req.flash('msglogin'));
      res.redirect('/login');
    }
  }
};
