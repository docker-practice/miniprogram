export default function buyBook(navigate: boolean = false) {
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
