const Router = require('koa-router');
const router = new Router();
const controllers = require('../controllers');

router.get('/', controllers.home);

router.post('/', controllers.sendMessage);

module.exports = router;
