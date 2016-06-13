'use strict';

const middleware = require('../middleware');
const controller = require('../controller');
const Router = require('koa-router');
const inner = new Router();
const router = new Router();

inner.get('/', controller.index.index);
inner.get('/header', controller.index.header);
inner.get('/article/:article', controller.index.detail);

router.use('/service', inner.routes(), inner.allowedMethods());
router.get('/build', controller.admin.build);
router.all('*', function*() {
	this.status = 404;
});

module.exports = router;