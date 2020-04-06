const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const router = new Router();
const app = new Koa();

app.use(serve('../public'));

router.get('/', async (ctx, next) => {
  try {
    ctx.body = 'Hello'; 
  } catch (e) {
    ctx.throw(400, err.message);
  }
});

app.use(router.routes());

app.listen(3001);
