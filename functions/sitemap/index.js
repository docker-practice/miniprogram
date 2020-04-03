// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const pages = require('./sitemap');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let result = await cloud.openapi.search
    .submitPages({
      pages,
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e;
    });

  return result;
};
