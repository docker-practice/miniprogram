import { IMyApp } from '../../app';
const app = getApp<IMyApp>();

import Font from '../../utils/Font';

Page({
  data: {
    switch: true,
    rate_index: 0,
    storageSize: '0 MB',
    fontType: '默认',
  },
  onLoad() {
    wx.getStorage({
      key: 'rate',
      success: (e: any) => {
        this.setData!({
          rate_index: e.data,
        });
      },
    });

    wx.getStorage({
      key: 'fontType',
      success: (e: any) => {
        this.setData!({
          fontType: e.data,
        });
      },
    });

    wx.getStorageInfo({
      success: (res: any) => {
        this.setData!({
          storageSize: (res.currentSize / 1024).toFixed(2) + ' MB',
        });
      },
    });
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

    wx.setStorage({
      key: 'rate',
      data: index,
    });
  },
  cleanup() {
    wx.clearStorage({
      success: () => {
        this.setData!({
          storageSize: '0.00 MB',
        });
      },
    });
  },
  zan() {
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=dhS32KPVsgs%3D',
    });
  },

  buyBook() {
    wx.showModal({
      title: '请在浏览器中打开',
      content:
        '点击确定复制网址，在浏览器中粘贴网址购买实体书《Docker 技术入门与实战》学习更多内容',
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data: 'https://u.jd.com/tKZmVG',
          });
      },
    });
  },

  favorites() {
    wx.showModal({
      title: '即将支持',
      content: '敬请期待',
      showCancel: false,
    });
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

    const fonts = ['默认', 'ZCOOL KuaiLe'];

    wx.showActionSheet({
      itemList: fonts,
      success: res => {
        const font = fonts[res.tapIndex];

        console.log(font);

        new Font().force(font);

        wx.setStorage({
          key: 'fontType',
          data: font,
        });

        app.globalData.fontType = font;

        this.setData!({
          fontType: font,
        });
      },
    });
  },
});
