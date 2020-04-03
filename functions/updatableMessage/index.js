// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  if (event.type === 'set') {
    return await setUpdatableMsg(event.activityId, event.targetState);
  }

  let result = await cloud.openapi.updatableMessage.createActivityId();

  if (result.errCode !== 0) {
    throw new Error('error');
  }

  let { activityId, expirationTime } = result;

  await db.collection('updatableMsg').add({
    data: {
      activityId,
      member_count: 0,
      expirationTime,
    },
  });

  return result;
};

async function setUpdatableMsg(activityId, targetState, templateInfo = null) {
  // 获取已加入人数
  let result = await db
    .collection('updatableMsg')
    .where({
      activityId,
    })
    .get();

  console.log(result);

  let member_count = result.data[0].member_count + 1;

  // 更新已加入人数
  await db
    .collection('updatableMsg')
    .where({
      activityId,
    })
    .update({
      data: {
        member_count,
      },
    });

  console.log(member_count);

  templateInfo = {
    parameter_list: [
      {
        name: 'member_count',
        value: member_count.toString(),
      },
      {
        name: 'room_limit',
        value: '10000',
      },
    ],
  };

  console.log(
    JSON.stringify({
      activityId,
      targetState,
      templateInfo,
    }),
  );

  return await cloud.openapi.updatableMessage.setUpdatableMsg({
    activityId,
    targetState,
    templateInfo,
  });
}
