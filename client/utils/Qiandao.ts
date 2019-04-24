import UserInfo from './UserInfo';

wx.cloud.init({
  env: 'pro-02adcb',
});

const db = wx.cloud.database({
  env: 'pro-02adcb',
});

function showVideoAd(openid: string, videAd: wx.RewardedVideoAd) {
  videAd.show().catch(err => {
    wx.showModal({
      title: '提示',
      content: JSON.stringify(err),
      showCancel: false,
    });
    videAd.load();
  });

  videAd.onClose(status => {
    console.log(status);

    if (status.isEnded) {
      // 存储签到时间
      wx.showModal({
        title: '签到成功',
        content: '积分 +2',
        showCancel: false,
      });
      let sign_time = getSignTime();
      addJifen(openid, 2, getSignTime());
      wx.setStorage({
        key: 'sign_time',
        data: sign_time,
      });
    } else {
      // 存储签到时间
      wx.showModal({
        title: '签到成功',
        content: '积分 +1',
        showCancel: false,
      });
      let sign_time = getSignTime();
      addJifen(openid, 1, sign_time);
      wx.setStorage({
        key: 'sign_time',
        data: sign_time,
      });
    }
  });
}

function sign(openid: string, videAd: any) {
  wx.showModal({
    title: '获得额外积分',
    content: '观看完整广告视频，额外获得 1 积分',
    confirmText: '立即签到',
    cancelText: '不要积分',
    success: res => {
      if (res.confirm) {
        showVideoAd(openid, videAd);
      } else {
        let sign_time = getSignTime();
        addJifen(openid, 1, sign_time);
        wx.setStorage({
          key: 'sign_time',
          data: sign_time,
        });
        wx.showModal({
          title: '签到成功',
          content: '积分 +1',
          showCancel: false,
        });
      }
    },
  });
}

function getEndTime(): number {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let offset = date.getTimezoneOffset() * 60 * 1000;
  return Date.UTC(year, month, day + 1) + offset;
}

function addJifen(_openid: string, jifen: number, sign_time: number) {
  db.collection('sign')
    .where({
      _openid,
    })
    .get()
    .then(res => {
      console.log(res);

      let { _id, sign_number = 0, jifen: jifen_from_db = 0 } = res.data[0];

      sign_number += 1;
      jifen += jifen_from_db;

      db.collection('sign')
        .doc(_id!)
        .update({
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
    return await new Promise(resolve => {
      wx.getStorage({
        key: 'sign_time',
        success: res => {
          let sign_time = res.data || 0;
          if (
            sign_time < getEndTime() &&
            sign_time > getEndTime() - 24 * 60 * 60 * 1000
          ) {
            return resolve(true);
          }

          return resolve(false);
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  }
  return await db
    .collection('sign')
    .where({
      _openid,
    })
    .get()
    .then(res => {
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
        wx.setStorage({
          key: 'sign_time',
          data: sign_time_from_db,
        });

        return true;
      }

      return false;
    });
}

function getSignTime(): number {
  return new Date().getTime();
}

export default function qiandao(videAd: any) {
  wx.showLoading({
    title: '加载中',
  });
  UserInfo.getOpenId().then(
    res => {
      // 获取 open_id
      let _openid = res;

      // 是否签到
      isSign(_openid).then(
        res => {
          wx.hideLoading();
          if (res) {
            wx.showModal({
              title: '已签到',
              content: '明天记得来学习哟',
              showCancel: false,
            });

            return;
          }
          // 签到
          sign(_openid, videAd);
        },
        () => {
          wx.showModal({
            title: '提示',
            content: '签到失败',
          });
        },
      );
    },
    res => {
      // 获取记录出错
      console.log(res);
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败',
      });
    },
  );
}
