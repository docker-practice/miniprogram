//index.js
//获取应用实例
import { IMyApp } from '../../app';

const app = getApp<IMyApp>();

Page({
  data: {
    motto: '点击 “编译” 以构建',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap() {
    // wx.navigateTo({
    //   url: '../logs/logs',
    // });
  },
  onLoad() {
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

  getUserInfo(e: any) {
    console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData!({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
    });
  },

  changeTheme() {
    let theme = wx.getStorageSync('theme');
    theme = theme === 'dark' ? 'light' : 'dark';

    wx.setStorage({
      key: 'theme',
      data: theme,
    });

    app.globalData.theme = theme;
  },

  clearStorage() {
    wx.clearStorage({
      success() {
        wx.showToast({
          title: 'success',
        });
      },
    });
  },

  copyLink() {
    wx.setClipboardData({
      data: 'https://github.com/yeasy/docker_practice/issues',
    });

    wx.showModal({
      title: '请在浏览器打开',
      content: '浏览器粘贴链接，在项目 GitHub 交流',
      showCancel: false,
    });
  },

  changeMirror() {
    app.globalData.baseUrl =
      'https://code.aliyun.com/khs1994-docker/docker_practice/raw/master';
  },

  settings() {
    let theme = wx.getStorageSync('theme');

    let itemList = [
      '分享',
      '暗黑模式',
      '打赏 👍',
      '技术交流',
      '登录 GitHub',
      '更多设置',
    ];

    theme === 'dark' ? (itemList[1] = '明亮模式') : '';

    const fs = wx.getFileSystemManager();

    let token: any;
    let tokenFile = `${wx.env.USER_DATA_PATH}/token`;

    try {
      token = fs.readFileSync(tokenFile);
    } catch (e) {}

    if (token) {
      itemList[3] = '登出 GitHub';
    }

    wx.showActionSheet({
      itemList,
      success: res => {
        let index = res.tapIndex;

        console.log(index);

        switch (index) {
          case 0:
            wx.previewImage({
              current:
                'https://gitee.com/khs1994-docker/docker_practice/raw/master/gh_410be172deaa_344.jpg',
              urls: [
                'https://gitee.com/khs1994-docker/docker_practice/raw/master/gh_410be172deaa_344.jpg',
              ],
            });
            break;
          case 1:
            this.changeTheme();
            break;
          case 2:
            wx.navigateToMiniProgram({
              appId: 'wx18a2ac992306a5a4',
              path: 'pages/apps/largess/detail?id=dhS32KPVsgs%3D',
            });
            break;
          case 3:
            this.copyLink();
            break;
          case 4:
            if (token) {
              fs.unlink({
                filePath: tokenFile,
              });

              return;
            }

            wx.navigateTo({
              url: '../login/index',
            });
            break;
          case 5:
            wx.navigateTo({
              url: '../settings/index',
            });
            break;
        }
      },
    });
  },
});
