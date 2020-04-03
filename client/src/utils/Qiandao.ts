import UserInfo from './UserInfo';
import Cache from '../Framework/src/Support/Cache';
import DB from '../Framework/src/Support/DB';

const cache = new Cache();
const db = DB.getInstance();

export function uploadAdError(err: any) {
  const errCode = err.code || err.errCode || 0;
  if (errCode == 1004) {
    return;
  }

  db.collection('adError')
    .add({
      data: {
        error: JSON.stringify(err),
      },
    })
    .then(
      () => {},
      () => {},
    );
}

function showVideoAd(openid: string, videAd: any) {
  videAd.show().catch((err: any) => {
    // error
    wx.showModal({
      title: '提示',
      content: JSON.stringify(err),
      showCancel: false,
    });

    uploadAdError(err);

    videAd.load().then(
      () => {
        videAd.show().then(
          () => {},
          (err: any) => {
            // error
            console.log(err);
            uploadAdError(err);
          },
        );
      },
      (err: any) => {
        // error
        console.log(err);
        uploadAdError(err);
      },
    );
  }); //show end

  videAd.onError((err: any) => {
    uploadAdError(err);
  });

  videAd.onClose((status: any) => {
    console.log(status);

    if (status.isEnded) {
      console.log('播放完成');
      wx.showModal({
        title: '签到成功',
        content: '积分 +2',
        showCancel: false,
      });
      let sign_time = getSignTime();
      addJifen(openid, 2, sign_time);

      cache.set('sign/time', `${sign_time}`, 0, true);
    } else {
      console.log('主动关闭');
      wx.showModal({
        title: '未完整播放',
        content: '积分 +0',
        showCancel: false,
      });
      let sign_time = getSignTime();
      addJifen(openid, 1, sign_time);
      // 存储签到时间
      cache.set('sign/time', `${sign_time}`, 0, true);
    }
  });
}

async function sign(openid: string, videAd: any) {
  return await new Promise((resolve) => {
    showVideoAd(openid, videAd);
    resolve(true);
  });
}

// 获取当天 24 点的时间戳
export function getEndTime(): number {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let offset = date.getTimezoneOffset() * 60 * 1000;
  return Date.UTC(year, month, day + 1) + offset;
}

async function addJifen(_openid: string, jifen: number, sign_time: number) {
  return await db
    .collection('sign')
    .where({
      _openid,
    })
    .get()
    .then((res) => {
      console.log(res);

      let { _id, sign_number = 0, jifen: jifen_from_db = 0 } = res.data[0];

      sign_number += 1;
      jifen += jifen_from_db;

      db.collection('sign').doc(_id!).update({
        data: {
          sign_time,
          sign_number,
          jifen,
        },
      });
    });
}

export async function isSign(_openid: string, local: boolean = false) {
  if (!_openid) {
    _openid = await UserInfo.getOpenId();
  }
  if (local) {
    try {
      let result = await cache.get('sign/time');

      if (result) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  let result = await db
    .collection('sign')
    .where({
      _openid,
    })
    .get()
    .then((res) => {
      console.log(res);

      if (res.data.length === 0) {
        // 新增记录
        db.collection('sign').add({
          data: {
            sign_number: 0,
            sign_time: 0,
            jifen: 0,
          },
        });

        return false;
      }

      // 记录存在
      let { sign_time: sign_time_from_db } = res.data[0];

      // 判断是否已签到
      if (
        sign_time_from_db < getEndTime() &&
        sign_time_from_db > getEndTime() - 24 * 60 * 60 * 1000
      ) {
        cache.set('sign/time', `${sign_time_from_db}`, 0, true);

        return true;
      }

      return false;
    });

  return result;
}

function getSignTime(): number {
  return new Date().getTime();
}

export async function checkTime(time: number = 0) {
  time === 0 && (time = getSignTime());
  return await wx.cloud
    .callFunction({
      name: 'time',
      data: {
        time,
      },
    })
    .then(
      (res) => {
        return res;
      },
      () => {
        return false;
      },
    );
}

export default async function qiandao(videAd: any) {
  wx.showLoading({
    title: '加载中',
  });

  if (!(await checkTime())) {
    wx.hideLoading();

    wx.showModal({
      title: '请检查设备时间设置',
      content: '设备时间与实际时间相差较大',
      showCancel: false,
    });

    return false;
  }

  let _openid: string;

  try {
    _openid = await UserInfo.getOpenId();
  } catch {
    wx.hideLoading();

    wx.showModal({
      title: '提示',
      content: '获取用户信息失败',
      showCancel: false,
    });

    return false;
  }

  let result = await isSign(_openid).then(
    (res) => {
      wx.hideLoading();

      if (res) {
        wx.showModal({
          title: '提示',
          content: '已解锁进阶内容',
          showCancel: false,
        });

        return false;
      }

      return true;
    },
    () => {
      wx.showModal({
        title: '提示',
        content: '签到失败',
      });

      return false;
    },
  );

  if (result) {
    return await sign(_openid, videAd);
  }

  return false;
}
