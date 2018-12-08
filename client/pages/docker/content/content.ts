import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

Page({
  data: {
    data: '',
  },

  onLoad() {
    this.show();
  },

  show(){
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

    setTimeout(()=>wx.hideNavigationBarLoading({}),1500);
  },
  __bind_touchend() {},
  __bind_touchstart() {},

  __bind_tap() {},

  __bind_touchmove() {},

  __bind_touchcancel() {},
});
