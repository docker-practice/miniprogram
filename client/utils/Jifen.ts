import UserInfo from './UserInfo';

wx.cloud.init({
  env: 'pro-02adcb',
});

export default class Jifen {
  async get() {
    return await UserInfo.getOpenId().then(async _openid => {
      console.log(_openid);
      return await wx.cloud
        .database({ env: 'pro-02adcb' })
        .collection('sign')
        .where({
          _openid,
        })
        .get()
        .then(res => {
          console.log(res);
          return res.data[0].jifen || 0;
        });
    });
  }
}
