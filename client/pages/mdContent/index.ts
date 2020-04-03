// pages/mdContent/index.js

import isqq from '../../src/utils/isqq';

let key: any = null;
let toDoActivityId: any;
let expirationTime: any;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ad: isqq
      ? ['f2ba7917096dc03c7d798df304a90c49', 'a4f45b9d8d5704ab70bebfd0780854a8']
      : ['adunit-3ea71b7cfce6c721', 'adunit-1246f0a5e441ea4c'],
    markdown: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    key = options.key;
    // 1585976131
    const { activityId, expirationTime } = options;

    console.log(JSON.stringify(options));

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

    if (!activityId) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
      title: '今日分享',
      path: `pages/mdContent/index?key=${key}&activityId=${toDoActivityId}&expirationTime=${expirationTime}`,
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
    };
  },
});
