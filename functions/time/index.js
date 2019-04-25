// 返回是否存在时间误差 5 分钟内
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const time = event.time;

  return Math.abs((time - new Date().getTime())) < 5 * 60 * 1000;
}
