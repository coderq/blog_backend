'use strict';
/* jshint node: true */

const fs = require('fs');
const path = require('path');

exports.build = function*() {
	// 资源路径
	let source_path = path.join(__dirname, '../source');
			
	// 获取资源路径下的所有文件
	let files = fs.readdirSync(source_path);
	files = files.filter(function(item) {
		// 过滤出.md结尾的文件
		return /\.md$/.test(item);
	}).map(function(item) {
		// 相对路径->绝对路径
		return path.join(source_path, item);
	});
	
	// 读取文件及文件信息
	let conf = files.map(function(file) {
		// 读取文件内容
		let content = fs.readFileSync(file).toString();
		// 解析出文件信息
		// TODO::下个版本换成yaml模块解析
		let config = content.split('---')[1].trim();
		let conf = {};
		config = config.split("\n").forEach(function(item) {
			let ary = item.split(':');
			let key = ary.shift().trim();
			let value = ary.join(':').trim();
			if (key == 'tags') {
				value = value.replace(/[\[\]\'\"]/g, '').split(/\s*,\s*/);
			}
			conf[key] = value;
		});
		return {
			file: file.split('/').pop(),
			conf: conf
		};
	});

	// 将所有文章按时间排序
	let articles = conf.sort(function(curr, prev) {
		return curr.conf.date < prev.conf.date ? 1 : -1;
	});
	// 从所有文章配置信息中过滤出所有文章类型，并去掉重复的类型，最后按字符串排序返回
	let types = conf.map(function(item) {
		return item.conf.categories;
	}).filter(function(item, index, self) {
		return item && self.indexOf(item) === index;
	}).sort(function(curr, prev) {
		return curr > prev ? 1 : -1;
	}).map(function(type) {
		return {
			name: type,
			articles: articles.filter(function(item) {
				return item.conf.categories == type;
			})
		};
	});
	// 从所有的文章配置信息中过滤出所有的文章标签，并去掉重复的标签，最后按字符串排序返回
	let tags = [].concat.apply([], articles.map(function(item) {
		return item.conf.tags;
	})).filter(function(item, index, self) {
		return item && self.indexOf(item) === index;
	}).sort(function(curr, prev) {
		return curr > prev ? 1 : -1;
	}).map(function(tag) {
		return {
			name: tag,
			articles: articles.filter(function(item) {
				return ~item.conf.tags.indexOf(tag);
			})
		};
	});
	// 定义数据库地址
	let db_path = path.join(__dirname, '../db');
	// 如果数据库地址不存在，则创建数据库地址
	try {
		if (!fs.lstatSync(db_path).isDirectory()) fs.mkdirSync(db_path);
	} catch (e) {
		fs.mkdirSync(db_path);
	}
	// 定义文件数据路径
	let article_path = path.join(__dirname, '../db/article.json');
	let type_path = path.join(__dirname, '../db/type.json');
	let tag_path = path.join(__dirname, '../db/tag.json');
	// 将文章信息写入article.json
	fs.writeFileSync(article_path, JSON.stringify(articles));
	// 将类型信息写入type.json
	fs.writeFileSync(type_path, JSON.stringify(types));
	// 将标签信息写入tag.json
	fs.writeFileSync(tag_path, JSON.stringify(tags));

	this.status = 200;
	this.body = 'done';
};