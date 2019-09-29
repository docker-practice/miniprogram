const env = 'pro-02adcb';

export default class Cloud {
  static instance = wx.cloud.init({
    env,
  });

  private constructor() {}

  static getInstance() {
    return this.instance;
  }
}
