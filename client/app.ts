import Cache from './src/Framework/src/Support/Cache';

const cache = new Cache();

export interface IMyApp {
  userInfoReadyCallback?(res: any): void;
  globalData: {
    userInfo?: any;
    MDData: any;
    theme?: 'light' | 'dark';
    fontType: string;
    [index: string]: any;
  };
}

export const baseUrls = [
  // 'https://gitee.com/docker_practice/docker_practice/raw/master',
  'https://code.aliyun.com/docker-practice/docker_practice/raw/master',
  'https://git.lug.ustc.edu.cn/docker-practice/docker_practice/raw/master',
];

App<IMyApp>({
  onLaunch() {
    // 显示红点
    wx.showTabBarRedDot({
      index: 1,
    });

    // 获取主题
    cache.get('style/theme').then((theme) => {
      this.globalData.theme = theme ? <'light' | 'dark'>theme : 'light';
    });

    // 设置字体
    cache.get('style/fontType').then((fontType: any) => {
      this.globalData.fontType = fontType || 'default';
    });

    // 登录
    wx.login({
      success(_res) {
        // console.log(_res.code)
        // 发送 _res.code 到后台换取 openId, sessionKey, unionId
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res: any) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res.userInfo);
              }
            },
          });
        }
      },
    });

    cache.get('baseUrlIndex').then(
      (res) => {
        this.globalData.baseUrl = baseUrls[res] || baseUrls[0];
        console.log(this.globalData.baseUrl);
      },
      (e) => {
        console.log(e);
        console.log('baseUrlIndex not found');
      },
    );
  },
  globalData: {
    MDData: '',
    theme: 'light',
    fontType: 'default',
    baseUrl:
      'https://code.aliyun.com/docker-practice/docker_practice/raw/master',
  },
});
