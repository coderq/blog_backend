'use strict';

let fs = require('fs');
let C = require("../config");
let U = require('./util');

/**
 * 导入某个目录下的所有文件
 *
 * @param path string 目录
 * @param keyfn function 将文件转为key的函数
 * @param excepts string|array 排除文件
 * @return object 读取的模块
 */
exports.import = function(path, keyfn, excepts) {
	if (excepts && !Array.isArray(excepts) && typeof excepts != 'string') 
		throw Error('Excepts type error.');

	excepts = excepts || [];
	excepts = Array.isArray(excepts) ? excepts : [excepts];

	let files = fs.readdirSync(path);
	files = files.filter(function(file) {
		return !~excepts.indexOf(file);
	});

	let modules = {};
	files.forEach(function(file) {
		let key = keyfn ? keyfn(file) : file.split('.').shift();
		if (!key) return;
		modules[key] = require(`${path}/${file}`);
	});

	return modules;
};