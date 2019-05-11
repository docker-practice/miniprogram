export default class Ad {
  bus() {
    // const url =
    //   'https://gitee.com/khs1994-docker/docker_practice/raw/master/bus.png';

    wx.showModal({
      title: '公交、地铁红包',
      content: '点击确定，在 『支付宝 APP』顶部搜索框粘贴内容领取红包。',
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data: '公交红包5353446',
          });
      },
    });
  }

  alipay() {
    const extra = '';
    // new Date().getMonth() === 2
    //   ? '3 月还可参加瓜分 9 亿活动，支付宝搜索『9亿』参加活动'
    //   : '';

    wx.showModal({
      title: '领红包',
      content:
        '点击确定，在 『支付宝 APP』顶部搜索框粘贴内容领取红包。' + extra,
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data:
              '打开支付宝首页搜“650310146”领红包，领到大红包的小伙伴赶紧使用哦！',
          });
      },
    });
  }

  yuebao() {
    wx.showModal({
      title: '领体验金',
      content: '点击确定，在 『支付宝 APP』顶部搜索框粘贴内容领取体验金。',
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data: '体验金68850946',
          });
      },
    });
  }

  buyBook(navigate: boolean = false) {
    if (navigate) {
      // wx.showModal({
      //   title: '请在浏览器中打开',
      //   content:
      //     '点击确定复制网址，在浏览器中粘贴网址购买实体书《Docker 技术入门与实战》学习更多内容',
      //   success(res) {
      //     res.confirm &&
      //       wx.setClipboardData({
      //         data: 'https://union-click.jd.com/jdc?e=&p=AyIGZRtYFAcXBFIZWR0yEgRQH1kXAhs3EUQDS10iXhBeGlcJDBkNXg9JHU4YDk5ER1xOGRNLGEEcVV8BXURFUFdfC0RVU1JRUy1OVxUBFwNXGVscMlt1T2AtSUFzYgJHJ0hkU04JQj9WXkQLWSteFQobBWUZXxUKFgJcE1klMhIEZUk1zbSk3%2FCqR8GondLdjGsVBBMAVBlaFQUQN1UfXxMBFwVUGlMVAhM3UhtSJVlHaVJIDxABG1cGTlsRAEU3ZRtYEAYQBVUSaxYyIjdVK1glQHwOAklbHFFFA1RIC0UHQQ9QSAgTUkZSABlbRgRCAVFJWiUAEwZREg%3D%3D&t=W1dCFFlQCxxKQgFHREkdSVJKSQVJHFRXFk9FUlpGQUpLCVBaTFhbXQtWVmpSWRtYEAYQBVUS',
      //       });
      //   },
      // });
      wx.navigateToMiniProgram({
        appId: 'wx13e41a437b8a1d2e',
        path:
          'pages/product/product?wareId=12453318&spreadUrl=https%3A%2F%2Fu.jd.com%2FndVmoG&customerinfo=1194225177',
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/book/index',
    });
  }
}
