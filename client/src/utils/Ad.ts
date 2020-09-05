export default class Ad {
  buyBook(navigate: boolean = false) {
    if (navigate) {
      wx.navigateToMiniProgram({
        appId: 'wx91d27dbf599dff74',
        path:
          'pages/item/detail/detail?utm_term=228d697a11624ec39f0693251c1a4b6a&cu=true&utm_campaign=t_351954893_&requestId=f286631b-2b50-41ed-b7e3-d55564e33871&utm_medium=jingfen&sku=12453318&utm_source=servicewechat.com',
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/book/index',
    });
  }
}
