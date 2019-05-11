import { IMyApp } from '../../app';
const app = getApp<IMyApp>();

import Font from '../../utils/Font';
import Ad from '../../utils/Ad';
import daShang from '../../utils/DaShang';
import Jifen from '../../utils/Jifen';
import UserInfo from '../../utils/UserInfo';
import Cache from '../../utils/Toolkit/Cache';

const cache = new Cache();
const ad = new Ad();

wx.cloud.init({
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
    ]).then(res => {
      console.log(res);
      this.setData!({
        rate_index: res[0] || 0,
        fontType: res[1] || '默认',
        jifen: res[2] || 0,
        sdkVersion: res[3] || '0.0.0',
        userNum: res[4] || 5702,
      });
    });

    wx.getStorageInfo({
      success: (res: any) => {
        this.setData!({
          storageSize: ((res.currentSize / 1024) as any).toFixed(2) + ' MB',
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
  },
  zan() {
    daShang();
  },

  buyBook() {
    ad.buyBook();
  },

  favorites() {
    wx.showModal({
      title: '即将支持',
      content: '敬请期待',
      showCancel: false,
    });
  },

  tucao() {
    UserInfo.getOpenId().then(res => {
      let openid = res;

      const userInfo = {
        avatar: app.globalData.userInfo!.avatarUrl,
        nickname: app.globalData.userInfo!.nickName,
        openid,
      };

      const extraData = {};

      // @ts-ignore
      const Tucao = requirePlugin('tucao').default;
      // 初始化并触发跳转，支持链式调用
      Tucao.init(void 0, {
        productId: 59821,
        navigateTo: wx.navigateTo,
        ...userInfo,
        extraData,
      }).go();
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
});
