'use strict';

let fs = require('fs');
let path = require('path');

// 重新加载数据库文件
function reloadDB(db) {
	let db_path = `../db/${db}.json`;
	delete require.cache[require.resolve(db_path)];
	return require(db_path);
}

// 首页
exports.index = function*() {
	// 文章类型
	let type = this.request.query.type;
	// 文章标签
	let tag = this.request.query.tag;
	// 第几页
	let page = Math.abs(~~this.request.query.page) || 1;
	// 显示几条
	let limit = Math.abs(~~this.request.query.limit) || 10;
	// 选择加载哪个数据库
	let db = reloadDB(type ? 'type' : tag ? 'tag' : 'article');
	// 类型或标签的名字
	let name = type || tag;
	let skip = (page - 1) * limit;

	if (name) {
		// 查找出数据库中类型或标签名称相匹配的文章
		try {
			db = db.filter((item) => item.name == name).shift().articles;
		} catch (e) {
			db = []
		}
	}

	// 获取要返回的内容，分页
	let ret = db.slice(skip, skip + limit);
	// 返回各类型及数量
	let types = reloadDB('type')
		.map(item => ({name: item.name, count: (item.articles || []).length}))
		.sort((a, b) => (a.count > b.count ? -1 : 1));
	
	this.status = 200;
	this.body = {articles: ret, types: types, page: page, limit: limit, total: db.length};
};

// 详情页
exports.detail = function*() {
	// 文章ID
	let article = this.params.article;
	// 读取对应的文章
	let file = path.join(__dirname, '../source', article);
	// 看是否有该文章，没有则返回404
	if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
		this.status = 410;
		this.body = {message: '没有该文章'};
	}
	// 读取文章内容
	let content = fs.readFileSync(file).toString();
	// 读取文章标题
	let title = content.match(/title\s*\:([^\r\n]+)/)[1].trim();
	let date = content.match(/date\s*\:([^\r\n]+)/)[1].trim();
	let categories = content.match(/categories\s*\:([^\r\n]+)/)[1].trim();
	let tags = content.match(/tags\s*\:([^\r\n]+)/)[1].trim().replace(/[\[\]\"\'\s]/g, '').split(',');

	this.status = 200;
	this.body = {
		title: title, 
		date: date,
		categories: categories,
		tags: tags,
		content: content.split('---').slice(2).join('---').trim()
	};
};

exports.header = function*() {
	this.status = 200;
	this.body = {
		nav: [{
			href: '/',
			icon: 'home',
			text: 'Home'
		}, {
			href: 'http://coderq.github.io',
			icon: 'github',
			text: 'Github'
		}],
		title: 'CoderQ\'s Blog',
		subtitle: [
			'No die. No live.',
			'Who am I. If someone can tell me who am I.'
		].sort(() => {
			var v = Math.random() - .5; 
			return v / Math.abs(v);
		}).shift(),
		seo: {
			title: 'CoderQ\'s Blog -- Who am I'
		}
	}
}