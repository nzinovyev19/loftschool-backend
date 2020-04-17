const fs = require('fs');
const path = require('path');
const model = require('../model');

module.exports.home = async (ctx, next) => {
  const skills = model.getSkills();
  const products = model.getProducts();
  await ctx.render('home.pug', {
    title: 'Home',
    skills,
    products,
    msgemail: ctx.flash('msgemail')[0]
  });
};

module.exports.sendMessage = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    model.setMessages(ctx.request.body);
    ctx.flash('msgemail', 'Форма успешно отправлена');
  } catch (e) {
    ctx.flash('msgemail', 'Ошибка при отправке формы');
  } finally {
    ctx.redirect('/#form');
  }
};

module.exports.isAuth = (ctx, next) => {
  if (ctx.session.isAuth) {
    return next();
  }
  ctx.redirect('/login');
};

module.exports.login = async (ctx, next) => {
  if (ctx.session.isAuth) {
    ctx.redirect('/admin');
  }
  await ctx.render('login.pug', {
    title: 'Login',
    msglogin: ctx.flash('msglogin')[0]
  });
};

module.exports.authorize = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    const { email, password } = ctx.request.body;
    const { email: adminEmail, password: adminPassword } = model.getAdminInfo();
    if (adminEmail !== email || adminPassword !== password) {
      throw new Error('Ошибка при авторизации');
    }
    ctx.session.isAuth = true;
    ctx.flash('msglogin', 'Форма успешно отправлена');
    ctx.redirect('/admin');
  } catch (e) {
    ctx.flash('msglogin', 'Ошибка при отправке формы');
    ctx.redirect('/login');
  }
};

module.exports.admin = async (ctx, next) => {
  const skills = model.getSkills();
  await ctx.render('admin.pug', {
    title: 'Admin',
    skills,
    msgfile: ctx.flash('msgfile')[0],
    msgskills: ctx.flash('msgskills')[0]
  });
};

module.exports.setSkills = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    model.setSkills(ctx.request.body);
    ctx.flash('msgskills', 'Данные успешно обновлены');
  } catch (e) {
    ctx.flash('msgskills', 'Ошибка при обновлении данных');
  } finally {
    ctx.redirect('/admin');
  }
};

module.exports.addProduct = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    console.log(ctx.request.files);
    const { name, price } = ctx.request.body;
    const { name: fileName, path: fileNamePath } = ctx.request.files.photo;
    fs.renameSync(fileNamePath, path.join(process.cwd(), 'public/assets/img/products', fileName));
    model.addProduct({
      src: `./assets/img/products/${fileName}`,
      name,
      price
    });
    ctx.flash('msgfile', 'Продукт успешно создан');
  } catch (e) {
    console.error(e);
    ctx.flash('msgfile', `Ошибка при создании продукта: ${e.message}`);
  } finally {
    ctx.redirect('/admin');
  }
};
