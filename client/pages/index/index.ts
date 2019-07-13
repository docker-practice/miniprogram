import { IMyApp } from '../../app';
const app = getApp<IMyApp>();
const fs = wx.getFileSystemManager();

import Font from '../../utils/Font';
import Ad from '../../utils/Ad';
import daShang from '../../utils/DaShang';
import Jifen from '../../utils/Jifen';
// import UserInfo from '../../utils/UserInfo';
import Cache from '../../utils/Toolkit/Cache';
import { getEndTime } from '../../utils/Qiandao';

const cache = new Cache();
const ad = new Ad();

wx.cloud.init({
  env: 'pro-02adcb',
});

const db = wx.cloud.database({
  env: 'pro-02adcb',
});

Page({
  data: {
    switch: true,
    rate_index: 0,
    storageSize: '0 MB',
    fontType: '默认',
    jifen: '获取中',
    sdkVersion: '0.0.0',
    userNum: 5700,
    signNum: '获取中',
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    theme: '明亮模式',
    gitHubStatus: '登录 GitHub',
  },
  onLoad() {
    Promise.all([
      cache.get('rate/index'),
      cache.get('style/fontType'),
      new Jifen().get(),
      new Promise(resolve => {
        wx.getSystemInfo({
          success: res => {
            resolve(res.SDKVersion);
          },
          fail: () => {
            resolve('0.0.0');
          },
        });
      }),
      wx.cloud
        .callFunction({
          name: 'getDailySummary',
          data: {},
        })
        .then(
          res => {
            return res.result;
          },
          e => {
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
    ]).then(res => {
      console.log(res);
      let signNum = res[5].data.length || 0;
      this.setData!({
        rate_index: res[0] || 0,
        fontType: res[1] || '默认',
        jifen: res[2] || 0,
        sdkVersion: res[3] || '0.0.0',
        userNum: res[4] || 5702,
        signNum: signNum > 20 ? '20+' : signNum,
      });

      this.setThemeTitle(res[6]);
      this.updateGitHubStatus(res[7] || false);
    });

    wx.getStorageInfo({
      success: (res: any) => {
        this.setData!({
          storageSize: ((res.currentSize / 1024) as any).toFixed(2) + ' MB',
        });
      },
    });

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
      app.userInfoReadyCallback = res => {
        this.setData!({
          userInfo: res,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData!({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
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
    wx.clearStorage({
      success: () => {
        this.setData!({
          storageSize: '0.00 MB',
        });
      },
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

    wx.showActionSheet({
      itemList: fonts,
      success: res => {
        const font = fonts[res.tapIndex];

        console.log(font);

        new Font().force(font);

        cache.set('style/fontType', font);

        app.globalData.fontType = font;

        this.setData!({
          fontType: font,
        });
      },
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
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data: 'https://github.com/yeasy/docker_practice/issues',
          });
      },
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
      let logoutConfirm = await new Promise(resolve => {
        wx.showModal({
          title: '提示',
          content: '是否注销 GitHub',
          cancelText: '我再想想',
          confirmText: '注销',
          success: res => {
            if (res.confirm) {
              resolve(1);
            }

            resolve(0);
          },
        });
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
});
