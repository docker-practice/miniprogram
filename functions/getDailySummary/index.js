// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

function getTime(isBegin = false) {
  let dateInstance = new Date();

  let year = dateInstance.getFullYear();
  let month = dateInstance.getMonth();
  let date = dateInstance.getDate();

  // 获取当天时间戳
  time =
    Date.UTC(year, month, date) + dateInstance.getTimezoneOffset() * 60 * 1000;
  // - 3600*24*1000 获取前一天的时间戳
  time = time - 3600 * 24 * 1000;

  if (isBegin) {
    // 获取前两天的时间戳
    time = time - 3600 * 24 * 1000;
  }

  // 转化为字符串
  dateInstance = new Date(time);

  year = dateInstance.getFullYear();
  month = dateInstance.getMonth() + 1;
  date = dateInstance.getDate();

  month = month < 10 ? `0${month}` : month;
  date = date < 10 ? `0${date}` : date;

  return `${year}${month}${date}`;
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext();

  try {
    let result = await cloud.openapi.analysis.getDailySummary({
      beginDate: getTime(),
      endDate: getTime(),
    });

    return result.list[0]['visitTotal'];
  } catch (e) {
    return e;
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
};
