// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database().collection('subscribeMessage');

async function send(touser, page) {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser,
      page,
      data: {
        thing1: {
          value: '使用 Buildx 构建镜像',
        },
        time2: {
          value: '2015年01月05日',
        },
        name3: {
          value: 'author',
        },
        name4: {
          value: 'admin',
        },
      },
      templateId: 'Frzqb0OUmqebNle3KJtrGN-X1M26ezf-5Bbpx9cBwp4',
    });
    // console.log(result);
    return result;
  } catch (err) {
    // console.log('[x] err' + touser + page);
    return err;
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  // 将订阅者 openid 存入数据库
  if (event.addOpenId === 1) {
    return await db.add({
      data: {
        openId: wxContext.OPENID,
      },
    });
  }

  // 发送订阅消息

  let openIds = [];

  await db.get().then(res => {
    console.log(res);

    res.data.map((k, v) => {
      openIds.push(k.openId);
    });
  });

  page = 'pages/docker/summary/index';

  // tests
  // openIds = ["oehia5bTRVpsBi2MvtrOShvZwBIQ"];

  console.log(openIds);

  if (openIds.length === 0) {
    console.log('no user subscribe');
    return;
  }

  // openIds.map(async k => {
  for (let index = 0; index < openIds.length; index++) {
    let touser = openIds[index];

    // let touser = k;
    await send(touser, page).then(
      async res => {
        await db
          .where({
            openId: touser,
          })
          .remove();

        console.log('[S] handled ' + touser);
        console.log(res);
      },
      async e => {
        await db
          .where({
            openId: touser,
          })
          .remove();

        console.log('[X] handled error ' + touser);
        console.log(e);
      },
    );
  }
  // });

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
};
