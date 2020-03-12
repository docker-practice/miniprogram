// pages/mdContent/index.js

import isqq from '../../src/utils/isqq';

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
  onLoad: function(options) {
    const { key } = options;
    wx.request({
      url:
        'https://code.aliyun.com/docker-practice/miniprogram/raw/master/' + key,
      success: res => {
        console.log(res);
        this.setData({
          // @ts-ignore
          markdown: res.data,
        });
      },
    });
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
  onShareAppMessage() {
    return {};
  },
});