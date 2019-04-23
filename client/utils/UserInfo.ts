wx.cloud.init({
  env: 'pro-02adcb',
});

export default class UserInfo {
  static async getOpenId() {
    return await wx.cloud
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
  }
}
