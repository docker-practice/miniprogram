wx.cloud.init({
  env: 'pro-02adcb',
});

export default class UserInfo {
  static async getOpenId() {
    let openId: string;

    openId = await new Promise(resolve => {
      wx.getStorage({
        key: 'openId',
        success(res) {
          resolve(res.data);
        },
        fail() {
          resolve(undefined);
        },
      });
    });

    if (openId) {
      console.log('get openid from cache');
      return openId;
    }

    openId = await wx.cloud
      .callFunction({
        name: 'sign',
        data: {
          k: 1,
        },
      })
      .then((res: any) => {
        // 获取 open_id
        return res.result.userInfo.openId;
      });

    wx.setStorage({
      key: 'openId',
      data: openId,
    });

    return openId;
  }
}
