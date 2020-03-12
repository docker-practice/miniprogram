const path = require('path');
const summaryPath = path.join(__dirname ,'summary.source.md');
const summaryMiniPath = path.join(__dirname , 'summary.mini.md');
const fs = require('fs');

try {
  fs.unlinkSync(summaryMiniPath);
} catch (e) {

}

let summary = fs.readFileSync(summaryPath, 'utf-8');

const line = summary.split('\n');

let array = [];
let sitemap = [];

line.forEach((v) => {
  // console.log(v);
  if (v.match(/^#/) !== null || !v){
    return;
  }

  let path;
  let key;

  try {
    key = v.split('](')[0].split('[')[1]
  } catch (e) {
    return;
  }

  try {
    path = v.split('(')[1].split(')')[0];
  } catch (e) {
    return;
  }

  let newPath = `../content/index?key=${path}`;
  v.replace(path, newPath);
  fs.appendFileSync(summaryMiniPath, v.replace(path, newPath) + '\n');

  array = [...array, { title: key, path: path }]

  sitemap = [ ...sitemap, {path: "pages/docker/content/index", query: "key="+path} ]
});

try{
fs.mkdirSync(__dirname + '/dist');
}catch{}

fs.writeFileSync(__dirname + '/dist/index.summary.json', JSON.stringify(array));
fs.writeFileSync(__dirname + '/../client/src/utils/index.summary.ts','export default '+JSON.stringify(array));

const listSummary = require('./list.summary');

fs.writeFileSync(__dirname + '/dist/list.summary.json',JSON.stringify(listSummary));
fs.writeFileSync(__dirname + '/../client/src/utils/list.summary.ts','export default '+JSON.stringify(listSummary));

fs.writeFileSync(__dirname + '/dist/cloud.db.json',JSON.stringify({
  _id: "summary",
  index: JSON.stringify(array),
  list: JSON.stringify(listSummary),
}))

fs.writeFileSync(__dirname + '/../functions/sitemap/sitemap.js','module.exports = ' + JSON.stringify(sitemap));
