'use strict';

let koa = require('koa');
let logger = require('koa-logger');
let router = require('./router');
let middleware = require('./middleware');
let C = require('./config');
let H = require('./library/helper');
let app = koa();

app.use(logger());
app.use(middleware());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(C.port, function() {
	console.log('App is listenning on port %s.', C.port);
});