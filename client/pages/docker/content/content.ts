import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

Page({
  data: {
    data: '',
  },

  onLoad() {
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
  },
  __bind_touchend() {},
  __bind_touchstart() {},

  __bind_tap() {},

  __bind_touchmove() {},

  __bind_touchcancel() {},
});
