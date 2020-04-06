const model = require('../model');

module.exports.home = (ctx, next) => {
  return ctx.render('home.pug', {
    title: 'Home',
    msgemail: ctx.flash('msgemail')[0]
  });
};

module.exports.sendMessage = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    await model.setMessages(ctx.request.body);
    ctx.flash('msgemail', 'Форма успешно отправлена');
  } catch (e) {
    ctx.flash('msgemail', 'Ошибка при отправке формы');
  } finally {
    ctx.redirect('/');
  }
};
