// pages/docker/summary/index.js

import list from './summary';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list,
  },

  kindToggle: function(e: any) {
    var id = e.currentTarget.id,
      list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData!({
      list: list,
    });
  },

  openGithub() {
    wx.showModal({
      title: '请在浏览器打开',
      content: '点击确定复制网址，在浏览器中粘贴网址打开',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'https://github.com/yeasy/docker_practice',
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {},

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
  // onShareAppMessage: function () {
  //
  // }
});
