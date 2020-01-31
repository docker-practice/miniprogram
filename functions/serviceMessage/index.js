// 云函数入口文件
const cloud = require('wx-server-sdk');
const { NLP, TencentAIError } = require('@khs1994/tencent-ai');
const fs = require('fs');

cloud.init();

function toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const msgType = event.MsgType;

  console.log(event);
  const wxContext = cloud.getWXContext();

  let openid = wxContext.OPENID;

  await cloud.openapi.customerServiceMessage.setTyping({
    touser: openid,
    command: 'Typing',
  });

  if (msgType === 'miniprogrampage') {
    if (event.PagePath === 'pages/docker/summary/index?wechatgroup=true') {
      await cloud.openapi.customerServiceMessage.send({
        touser: openid,
        msgtype: 'text',
        text: {
          content: '长按识别二维码，加入微信群聊',
        },
      });

      const buffer = fs.readFileSync('qr.jpg');

      let res = await cloud.openapi.customerServiceMessage.uploadTempMedia({
        type: 'image',
        media: {
          contentType: 'image/jpg',
          value: buffer,
        },
      });

      await cloud.openapi.customerServiceMessage.send({
        touser: openid,
        msgtype: 'image',
        image: {
          mediaId: res.mediaId,
        },
      });

      return event;
    }
  }

  const AIApp = {
    // 设置请求数据（应用密钥、接口请求参数）
    appkey: process.env.TENCENTAIAPPKEY,
    appid: process.env.TENCENTAIAPPID,
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
    command: 'CancelTyping',
  });

  return event;
};
