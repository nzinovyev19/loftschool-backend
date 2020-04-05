const db = require('../model');
const { getSkills, setMessages, getProducts } = db;

module.exports = {
  getHomePage: (req, res) => {
    const skills = getSkills();
    const products = getProducts();
    res.render('pages/home', {
      title: 'Home',
      skills,
      products,
      msgemail: req.flash('msgemail')[0]
    });
  },
  sendMessage: (req, res) => {
    try {
      console.log(req.body);
      setMessages(req.body);
      req.flash('msgemail', 'Форма обработана');
    } catch (e) {
      req.flash('msgemail', e.message);
    } finally {
      res.redirect('/#form');
    }
  }
};
