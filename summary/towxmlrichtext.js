const fs = require('fs');

const towxml = require('../client/node_modules/towxml');

//Markdown 转 towxml 数据
let obj = towxml('![](https://)', 'markdown');

// nodes: [{
//   name: 'div',
//   attrs: {
//     class: 'div_class',
//     style: 'line-height: 60px; color: red;'
//   },
//   children: [{
//     type: 'text',
//     text: 'Hello&nbsp;World!'
//   }]
// }]
// }

function parser(obj){
  let nodes= [];
  let children;
  console.log(obj);
for (const iterator of obj) {
  let name = iterator._e.tagName;
  let attrs = iterator.attr;
  let childrens = iterator.child;
  let type;
  let text;
  if(iterator.node === 'text'){
    type = 'text';
    text = iterator.text;
    if (text === '\n'){
      continue;
    }
  }
  console.log(childrens);
  if(childrens){
    children = parser(childrens);
  }
  nodes = [...nodes,{name,attrs,children,type,text}];
  }

return nodes;
}

fs.writeFileSync(__dirname + '/richtextNodes.js',"exports="+JSON.stringify(parser(obj.child)));
