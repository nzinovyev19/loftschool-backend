const db = require('../model');
const { getSkills } = db;

module.exports = {
  getHomePage: (req, res) => {
    const skills = getSkills();
    res.render('pages/home', {
      title: 'Home page',
      skills,
      products: [],
      msgemail: req.flash('msgemail')[0]
    });
  },
  sendMessage: (req, res) => {
    try {
      console.log(req.body);
      req.flash('msgemail', 'Форма обработана');
    } catch (e) {
      req.flash('msgemail', e.message);
    } finally {
      res.redirect('/#form');
    }
  }
};
