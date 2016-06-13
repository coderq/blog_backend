'use strict';

const U = require('./library/util');
const ENV = process.env;

U.namespace(ENV, 'BLOG.BACKEND');

exports.mongo = {
	host: ENV.MONGO_HOST || '127.0.0.1',
	port: ENV.MONGO_PORT || 27017,
	user: ENV.MONGO_USER,
	pass: ENV.MONGO_PASS
};

exports.redis = {
	host: ENV.REDIS_HOST || '127.0.0.1',
	port: ENV.REDIS_PORT || 6379
};

exports.jwt = {
	algorithm: 'HS256',
	expiresIn: '7d',
	secret: 'your secret'
}

exports.port = ENV.PORT || 3000;