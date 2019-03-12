const Towxml = require('../client/node_modules/towxml');
const towxml = new Towxml();
const fs = require('fs');

let targetPath = '../client/pages/docker/index/summary.js';

try {
  fs.accessSync(targetPath);
  console.log('file exists');

} catch (e) {

  //Markdown转towxml数据
  let data = towxml.toJson(fs.readFileSync('./summary.md', 'utf-8'), 'markdown');

  fs.writeFileSync(targetPath, 'module.exports=' + JSON.stringify(data));

  // htm转towxml数据
  // let data = towxml.toJson('<h1>Article title</h1>','html');
}

targetPath = '../client/pages/docker/content/util/summary.ts';

try {
  fs.accessSync(targetPath);
}catch(e){
  fs.copyFileSync('./summary.ts',targetPath)
}
