// pages/mdContent/index.js

import { IMyApp } from '../../app';
import isqq from '../../src/utils/isqq';
import Cache from '../../src/Framework/src/Support/Cache';

let key: any = null;
let title: any;
let toDoActivityId: any;
let expirationTime: any;
let cache = new Cache();
let theme: 'light' | 'dark' = 'light';
const app = getApp<IMyApp>();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ad: isqq
      ? ['f2ba7917096dc03c7d798df304a90c49', 'a4f45b9d8d5704ab70bebfd0780854a8']
      : ['adunit-3ea71b7cfce6c721', 'adunit-1246f0a5e441ea4c'],
    markdown: '',
    openGId: null,
    theme: 'light',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(JSON.stringify(options));

    theme = app.globalData.theme;
    this.setData({
      theme,
    })

    key = options.key;
    title = options.title;
    // 1585976131
    const { activityId, expirationTime } = options;
    toDoActivityId = null;

    let { shareTicket } = wx.getLaunchOptionsSync();

    console.log('shareTicket: ' + shareTicket);
    console.log('activityId: ' + activityId);

    if (activityId && shareTicket) {
      wx.showModal({
        title: '欢迎从群聊中进入',
        content: '您的每次进入，都会增加所在群的排名',
        showCancel: false,
      });

      wx.getShareInfo({
        shareTicket,
        success: async (res) => {
          let { cloudID } = res;

          let result = await wx.cloud.callFunction({
            name: 'getGroup',
            data: {
              // @ts-ignore
              group: wx.cloud.CloudID(cloudID), // 这个 CloudID 值到云函数端会被替换
            },
          });

          console.log(result);

          this.setData({
            // @ts-ignore
            openGId: result.result,
          });
        },
      });
    }

    wx.request({
      url:
        'https://code.aliyun.com/docker-practice/miniprogram/raw/master/' + key,
      success: (res) => {
        console.log(res);
        this.setData({
          // @ts-ignore
          markdown: res.data,
        });
      },
    });

    // 插屏广告
    if ((await cache.get('is-news-show-ad')) !== 'true') {
      let interstitialAd = wx.createInterstitialAd({
        adUnitId: isqq
          ? 'b9b0567ae11780a9f7886b61683c1ae2'
          : 'adunit-6ef44789d84b9392',
      });

      setTimeout(() => {
        interstitialAd.show().then(
          () => {
            console.log('S 插屏广告 success');
            cache.set('is-news-show-ad', 'true', 120);
          },
          (e) => {
            console.log('E 插屏广告 error: ' + JSON.stringify(e));
          },
        );
      }, 15000);

      interstitialAd.onError((e) => {
        console.log('E 插屏广告 onerror: ' + JSON.stringify(e));
      });

      interstitialAd.onLoad(() => {
        console.log('L 插屏广告 onload');
      });

      interstitialAd.onClose(() => {
        console.log('X 插屏广告 onclose');
      });
    } else {
      console.log('120s 之内不再展示广告');
    } // if end

    if (!activityId) {
      return;
    }

    if (activityId === 'null') {
      return;
    }

    // @ts-ignore
    if (Date.parse(new Date()) / 1000 > expirationTime) {
      wx.showModal({
        title: '分享已经结束',
        content: '',
      });
    } else {
      wx.showModal({
        title: '欢迎进入',
        content:
          '结束日期 ' + new Date(<any>expirationTime * 1000).toLocaleString(),
      });
    }

    let targetState = 0;
    let templateInfo = [
      {
        name: 'member_count',
        value: '',
      },
      {
        name: 'room_limit',
        value: '',
      },
    ];

    // 更新动态消息
    let result: any = await wx.cloud.callFunction({
      name: 'updatableMessage',
      data: {
        type: 'set',
        activityId,
        targetState,
        templateInfo,
      },
    });

    console.log(result);
  },

  onUnLoad() {
    toDoActivityId = null;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  // @ts-ignore
  async share() {
    let result: any = await wx.cloud.callFunction({
      name: 'updatableMessage',
      data: {},
    });

    let { activityId, expirationTime: exp } = result.result;

    toDoActivityId = activityId;
    expirationTime = exp;

    result = await wx.updateShareMenu({
      withShareTicket: true,
      isUpdatableMessage: true,
      activityId: toDoActivityId, // 活动 ID
      // toDoActivityId,
      templateInfo: {
        parameterList: [
          {
            name: 'member_count',
            value: '1',
          },
          {
            name: 'room_limit',
            value: '10000',
          },
        ],
      },
    });

    console.log(result);

    await wx.showModal({
      title: '动态消息创建成功',
      content: '请点击右上角分享到群聊中',
      showCancel: false,
    });
  },

  onShareAppMessage(): any {
    return {
      title: '今日分享 -- ' + title,
      path: `pages/mdContent/index?key=${key}&title=${title}&activityId=${toDoActivityId}&expirationTime=${expirationTime}`,
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
    };
  },
});
