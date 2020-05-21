// pages/docker/index.js

import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

import summaryHandler from './summaryHandler';

import isqq from '../../../src/utils/isqq';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    lazy: false,
    spinShow: true,
    isqq,
    theme: 'light',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.show();

    this.setData({
      theme: app.globalData.theme || 'light',
    });
  },

  newSummary() {
    wx.navigateTo({
      url: '../summary/index',
    });
  },

  show() {
    const baseUrl = app.globalData.baseUrl;
    let url = baseUrl + '/SUMMARY.md';

    wx.showLoading({ title: '加载中' });

    wx.request({
      url,
      success: (res: any) => {
        this.setData!({
          data: summaryHandler(res.data),
        });
      },
    });
    // },
    // });

    // wx.setNavigationBarColor({
    //   backgroundColor: theme === 'dark' ? '#000000': '#ffffff',
    //   frontColor: theme === 'dark' ? '#ffffff': '#000000',
    //   animation: {},
    // });

    setTimeout(() => {
      wx.hideLoading({});

      this.setData!({
        lazy: true,
        spinShow: false,
      });
    }, 1000);
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
  onShareAppMessage: function (): any {
    return {
      title: '开始 Docker 之旅~',
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
    };
  },
  __bind_touchend() {},
  __bind_touchstart() {},

  __bind_tap() {},

  __bind_touchmove() {},

  __bind_touchcancel() {},
  adError(e: any) {
    console.log(e);
  },
  adSuccess(res: any) {
    console.log(res);
  },
});
