import Cache from '../Framework/src/Support/Cache';

wx.cloud.init({
  env: 'pro-02adcb',
});

const cache = new Cache();

export default class UserInfo {
  static async getOpenId() {
    let openId: string;

    openId = await cache.get('userinfo/openId');

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
        return res.result.openid;
      });

    cache.set('userinfo/openId', openId);

    return openId;
  }
}
