const summaryPath = __dirname + '\\summary.source.md';
const summaryMiniPath = __dirname + '\\summary.mini.md';
const fs = require('fs');

try {
  fs.unlinkSync(summaryMiniPath);
} catch (e) {

}

let summary = fs.readFileSync(summaryPath, 'utf-8');

const line = summary.split('\n');

let array = [];

line.forEach((v) => {
  // console.log(v);
  if (!v) {
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
});

fs.writeFileSync(__dirname + '\\summary.ts', 'export default ' + JSON.stringify(array));
fs.copyFileSync(__dirname + '\\summary.ts',
  __dirname + '/../client/src/Framework/src/Support/Summary/summary.ts');