import { IMyApp, baseUrls } from '../../app';
const app = getApp<IMyApp>();
const fs = wx.getFileSystemManager();

import Font from '../../src/utils/Font';
import Ad from '../../src/utils/Ad';
import daShang from '../../src/utils/DaShang';
import Jifen from '../../src/utils/Jifen';
// import UserInfo from '../../utils/UserInfo';
import Cache from '../../src/Framework/src/Support/Cache';
import { getEndTime } from '../../src/utils/Qiandao';
import DB from '../../src/Framework/src/Support/DB';
import isqq from '../../src/utils/isqq';

const cache = new Cache();
const ad = new Ad();

wx.cloud.init({
  env: 'pro-02adcb',
});

const db = DB.getInstance();

// wx.cloud
// .callFunction({
//   name: 'sitemap',
//   data: {},
// }).then(res=>{
//   console.log(res);
// }).catch(e=>{
//   console.log(e);
// });

Page({
  data: {
    switch: true,
    rate_index: 0,
    storageSize: '0 MB',
    fontType: '默认',
    jifen: '获取中...',
    sdkVersion: '0.0.0',
    version: '0.0.0',
    userNum: 5700,
    signNum: '获取中...',
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    theme: '明亮模式',
    gitHubStatus: '登录 GitHub',
    isTest: false,
    mdEngine: '获取中...',
  },
  onPullDownRefresh() {
    this.onLoad();
  },
  onLoad() {
    Promise.all([
      cache.get('rate/index'),
      cache.get('style/fontType'),
      new Jifen().get(),
      wx.getSystemInfo().then((res) => {
        return Promise.resolve(res.SDKVersion);
      }),
      isqq
        ? () => {
            return 1000;
          }
        : wx.cloud
            .callFunction({
              name: 'getDailySummary',
              data: {},
            })
            .then(
              (res) => {
                return res.result;
              },
              (e) => {
                console.log(e);
                return 5701;
              },
            ),
      db
        .collection('sign')
        .where({
          sign_time: db.command.gte(getEndTime() - 24 * 3600 * 1000),
        })
        .get(),
      cache.get('style/theme'),
      this.getGitHubStatus(),
      cache.get('system/md-engine'),
    ]).then((res: any) => {
      console.log(res);
      let signNum = res[5].data.length || 0;
      this.setData!({
        rate_index: res[0] || 0,
        fontType: res[1] || '默认',
        jifen: res[2] || 0,
        // @ts-ignore
        sdkVersion: res[3] || '0.0.0',
        // @ts-ignore
        userNum: res[4] || 5702,
        // @ts-ignore
        signNum: signNum > 20 ? '20+' : signNum,
        mdEngine: res[8] || 'wx-markdown-richtext',
      });

      this.setThemeTitle(res[6]);
      this.updateGitHubStatus(res[7] || false);
    });

    if (!isqq) {
      wx.getStorageInfo().then((res: any) => {
        this.setData!({
          storageSize: ((res.currentSize / 1024) as any).toFixed(2) + ' MB',
          // @ts-ignore
          version: wx.getAccountInfoSync().miniProgram.version || 'dev',
        });
      });
    }
    wx.hideTabBarRedDot({
      index: 1,
    });

    if (app.globalData.userInfo) {
      this.setData!({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData!({
          userInfo: res,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData!({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }

    wx.stopPullDownRefresh();
  },
  onChange(e: any) {
    console.log(e);
    this.setData!({
      switch: e.detail.value,
    });
  },
  rate(e: any) {
    const index = e.detail.index;

    this.setData!({
      rate_index: index,
    });

    cache.set('rate/index', index);
  },
  cleanup() {
    wx.clearStorage().then(() => {
      this.setData!({
        storageSize: '0.00 MB',
      });
    });

    wx.showToast({
      title: '清理成功',
      mask: true,
    });
  },
  zan() {
    daShang();
  },

  buyBook() {
    ad.buyBook();
  },

  favorites() {
    wx.showModal({
      title: '敬请期待',
      content: '',
      showCancel: false,
    });
  },

  tucao() {
    wx.showModal({
      title: '敬请期待',
      content: '',
      showCancel: false,
    });
    // UserInfo.getOpenId().then(res => {
    // let openid = res;
    //
    // const userInfo = {
    //   avatar: app.globalData.userInfo!.avatarUrl,
    //   nickname: app.globalData.userInfo!.nickName,
    //   openid,
    // };

    // const extraData = {};

    // @ts-ignore
    // const Tucao = requirePlugin('tucao').default;
    // 初始化并触发跳转，支持链式调用
    // Tucao.init(void 0, {
    //   productId: 59821,
    //   navigateTo: wx.navigateTo,
    //   ...userInfo,
    //   extraData,
    // }).go();
    // });
  },

  chooseFont() {
    const res = wx.getSystemInfoSync();

    if (res.platform === 'android') {
      wx.showModal({
        title: 'Android 暂不支持此功能',
        content: '快马加鞭开发中...',
        showCancel: false,
      });

      return;
    }

    const fonts: Array<string> = ['默认', 'ZCOOL KuaiLe'];

    wx.showActionSheet({ itemList: fonts }).then((res) => {
      const font = fonts[res.tapIndex];

      console.log(font);

      new Font().force(font);

      cache.set('style/fontType', font);

      app.globalData.fontType = font;

      this.setData!({
        fontType: font,
      });
    });
  },

  oldMenu() {
    wx.navigateTo({
      url: '/pages/docker/index/index',
    });
  },

  //事件处理函数
  bindViewTap() {
    // wx.navigateTo({
    //   url: '../logs/logs',
    // });
  },

  getUserInfo(e: any) {
    console.log(e);
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return;
    }

    app.globalData.userInfo = e.detail.userInfo;
    this.setData!({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },

  setThemeTitle(theme: string) {
    if (theme === undefined) {
      theme = 'light';
    }

    this.setData!({
      theme: theme === 'light' ? '明亮模式' : '暗黑模式',
    });
  },

  changeTheme() {
    cache.get('style/theme').then((theme: any) => {
      theme = theme === 'dark' ? 'light' : 'dark';
      cache.set('style/theme', theme);

      app.globalData.theme = theme;

      this.setThemeTitle(theme);

      wx.showToast({
        title: '切换成功',
        mask: true,
      });
    });
  },

  clearStorage() {
    cache.flush().then(
      () => {
        wx.showToast({
          title: 'success',
        });
      },
      () => {},
    );
  },

  copyLink() {
    wx.showModal({
      title: '请在浏览器打开',
      content:
        '点击确定复制网址，在浏览器中打开项目 GitHub 与 Docker 爱好者交流',
    }).then((res) => {
      res.confirm &&
        wx.setClipboardData({
          data: 'https://github.com/yeasy/docker_practice/issues',
        });
    });
  },

  changeMirror() {
    app.globalData.baseUrl =
      'https://code.aliyun.com/khs1994-docker/docker_practice/raw/master';
  },

  getGitHubStatus() {
    const fs = wx.getFileSystemManager();

    let token: any;
    let tokenFile = `${wx.env.USER_DATA_PATH}/token`;

    try {
      token = fs.readFileSync(tokenFile);
    } catch (e) {}

    if (token) {
      return true;
    }

    return false;
  },

  updateGitHubStatus(isLogin: boolean = false) {
    this.setData!({
      gitHubStatus: isLogin ? '注销 GitHub' : '登录 GitHub',
    });
  },

  async loginGitHub() {
    // let theme = await cache.get('style/theme');

    // theme === 'dark' ? (itemList[1] = '明亮模式') : '';

    let tokenExists = this.getGitHubStatus();
    let tokenFile = `${wx.env.USER_DATA_PATH}/token`;

    if (tokenExists) {
      let logoutConfirm = await wx
        .showModal({
          title: '提示',
          content: '是否注销 GitHub',
          cancelText: '我再想想',
          confirmText: '注销',
        })
        .then((res) => {
          if (res.confirm) {
            return Promise.resolve(1);
          }

          return Promise.resolve(0);
        });

      if (!logoutConfirm) {
        return;
      }
      fs.unlink({
        filePath: tokenFile,
      });

      wx.showLoading({
        title: '注销中',
        mask: true,
      });

      setTimeout(() => {
        wx.hideLoading({});
        this.updateGitHubStatus();
      }, 500);

      return;
    }

    wx.navigateTo({
      url: '../login/index',
    });
  },

  share() {
    const url =
      'https://gitee.com/khs1994-docker/docker_practice/raw/master/gh_410be172deaa_344.jpg';
    wx.previewImage({
      current: url,
      urls: [url],
    });
  },

  onShow() {
    this.updateGitHubStatus(this.getGitHubStatus());
  },

  async switchSource() {
    let itemList = ['A 云', 'USTC'];

    const baseUrlIndex = await cache.get('baseUrlIndex');

    // if (baseUrlIndex === '1' || baseUrlIndex === '2') {
    if (baseUrlIndex === '1') {
      itemList[baseUrlIndex] += '(已选择)';
    } else {
      itemList[0] += '(已选择)';
    }

    wx.showActionSheet({ itemList }).then((res) => {
      cache.set('baseUrlIndex', res.tapIndex.toString());

      let url = baseUrls[res.tapIndex];
      app.globalData.baseUrl = url;
      console.log(url);
    });
  },

  async switchEngine() {
    let itemList = [
      'wx-markdown',
      'wx-markdown-richtext',
      'wemark',
      'wemark-richtext',
    ];

    wx.showActionSheet({ itemList }).then((res) => {
      let mdEngine = itemList[res.tapIndex];
      cache.set('system/md-engine', mdEngine);
      this.setData!({
        mdEngine,
      });
    });
  },
});
