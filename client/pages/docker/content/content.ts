import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

Page({
  data: {
    data: '',
  },

  onLoad() {
    this.show();
  },

  show() {
    wx.showNavigationBarLoading({});

    const data = app.towxml.toJson(app.globalData.MDData, 'markdown');

    const theme = app.globalData.theme;

    data.theme = theme;

    this.setData!({
      data,
    });

    // wx.setNavigationBarColor({
    //   backgroundColor: theme === 'dark' ? '#000000': '#ffffff',
    //   frontColor: theme === 'dark' ? '#ffffff': '#000000',
    //   animation: {},
    // });

    setTimeout(() => wx.hideNavigationBarLoading({}), 1500);
  },
  onShareAppMessage: function(): any {
    return {
      title: '开始 Docker 之旅~',
      path: '/pages/docker/index/index',
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
      success() {
        wx.showToast({
          title: '感谢支持',
        });
      },
      fail() {
        wx.showToast({
          title: '转发失败',
          icon: 'success',
        });
      },
    };
  },
  __bind_touchend() {},
  __bind_touchstart() {},

  __bind_tap() {},

  __bind_touchmove() {},

  __bind_touchcancel() {},
});
