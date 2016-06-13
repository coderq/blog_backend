'use strict';

let C = require('../library/util');
let H = require('../library/helper');

module.exports = function() {
	return function*(next) {
		this.sendJsonp = function*(body, status) {
			let cb = tihs.request.query.callback || 'callback';
			this.status = status || 200;
			body = JSON.stringify(body);
			this.body = `${cb}(${body})`;
		}
		yield next;	
	}
};