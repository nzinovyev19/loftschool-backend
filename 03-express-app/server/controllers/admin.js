const db = require('../model');
const { updateSkills, createProduct, getSkills } = db;

module.exports = {
  getAdminPage: (req, res) => {
    const skills = getSkills();
    res.render('pages/admin', {
      title: 'Admin',
      skills,
      msgfile: req.flash('msgfile')[0],
      msgskill: req.flash('msgskill')[0]
    });
  },
  setSkills: (req, res) => {
    try {
      console.log(req.body);
      updateSkills(req.body);
      req.flash('msgskill', 'Данные успешно обновлены');
    } catch (e) {
      req.flash('msgskill', 'Ошибка при обновлении данных');
    } finally {
      res.redirect('/admin');
    }
  },
  setProducts: (req, res) => {
    try {
      console.log(req.body, req.file);
      const { name, price } = req.body;
      const { filename } = req.file;
      createProduct({ name, price, src: `./assets/img/products/${filename}` });
      req.flash('msgfile', 'Данные успешно добавлены');
    } catch (e) {
      req.flash('msgfile', 'Ошибка при добавлении данных');
    } finally {
      res.redirect('/admin');
    }
  }
};
