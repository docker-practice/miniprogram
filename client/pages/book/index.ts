import buyBook from '../../utils/BuyBook';

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  buyBook() {
    buyBook(true);
  },

  share() {
    let imgUrl =
      'https://user-images.githubusercontent.com/16733187/57310918-3c3afd80-711d-11e9-8816-266e5ede70bb.jpg';
    wx.previewImage({
      current: imgUrl,
      urls: [imgUrl],
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
  onShareAppMessage: function() {
    return {};
  },
});
