const Koa = require('koa');
const path = require('path');
const Pug = require('koa-pug');
const serve = require('koa-static');
const flash = require('koa-better-flash');
const session = require('koa-session');
const router = require('./routes');
const app = new Koa();
const pug = new Pug({
  viewPath: path.resolve(__dirname, '../source/template/pages'),
  pretty: false,
  noCache: true,
  app: app
});

app.use(serve(path.join(__dirname, '../public')));

app.keys = ['keys'];
app.use(session(app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
