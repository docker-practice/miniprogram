// pages/docker/redirect.js

import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options: any) {
    console.log(options);

    let { key = false } = options;

    if (key) {
      console.log(key);

      // @ts-ignore
      wx.reportAnalytics('pages', {
        page: key,
      });

      let url = `https://ci.khs1994.com/proxy_github_raw/yeasy/docker_practice/master/${key}`;

      if (key === 'README.md') {
        url =
          'https://ci.khs1994.com/proxy_github_raw/khs1994-docker/docker_practice/master/README.md';
      }

      wx.request({
        url,
        success(res: any) {
          app.globalData.MDData = res.data;

          wx.redirectTo({
            url: '../content/content',
          });
        },
      });

      return;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function(): any {},

  __bind_touchend() {},
  __bind_touchstart() {},

  __bind_tap() {},

  __bind_touchmove() {},

  __bind_touchcancel() {},
});
