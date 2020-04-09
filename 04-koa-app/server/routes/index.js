const path = require('path');
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const controllers = require('../controllers');

router.get('/', controllers.home);

router.post('/', koaBody(), controllers.sendMessage);

router.get('/login', controllers.login);

router.post('/login', koaBody(), controllers.authorize);

router.get('/admin', controllers.isAuth, controllers.admin);

router.post('/admin/skills', koaBody(), controllers.setSkills);

router.post('/admin/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(process.cwd(), './public/assets/img/products')
  }
}), controllers.addProduct);

module.exports = router;
