// 云函数入口文件
const cloud = require('wx-server-sdk');
const {
  NLP,
  TencentAIError
} = require('@khs1994/tencent-ai');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  let openid = wxContext.OPENID;

  await cloud.openapi.customerServiceMessage.setTyping({
    touser: openid,
    command: 'Typing'
  });

  const AIApp = {
    // 设置请求数据（应用密钥、接口请求参数）
    appkey: process.env.TENCENTAIAPPKEY,
    appid: process.env.TENCENTAIAPPID
  };

  const nlp = new NLP(AIApp.appkey, AIApp.appid);
  let res = await nlp.textChat(event.Content, event.FromUserName);

  await cloud.openapi.customerServiceMessage.send({
    touser: openid,
    msgtype: 'text',
    text: {
      content: res.ret === 0 ? res.data.answer : '有什么可以帮助到您',
    },
  });

  // const sleep = (timeountMS) => new Promise((resolve) => {
  //   setTimeout(resolve, timeountMS);
  // });
  //
  // await sleep(3000);

  await cloud.openapi.customerServiceMessage.setTyping({
    touser: openid,
    command: 'CancelTyping'
  });

  return event;
}
