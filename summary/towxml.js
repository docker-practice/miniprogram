const Towxml = require('../client/node_modules/towxml');
const towxml = new Towxml();
const fs = require('fs');

let targetPath = '../client/pages/docker/index/summary.js';
fs.unlinkSync(targetPath);

//Markdown 转 towxml 数据
let data = towxml.toJson(fs.readFileSync('./summary.mini.md', 'utf-8'), 'markdown');

fs.writeFileSync(targetPath, 'module.exports=' + JSON.stringify(data));

// html 转 towxml 数据
// let data = towxml.toJson('<h1>Article title</h1>','html');