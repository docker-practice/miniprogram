export default function buyBook() {
  wx.showModal({
    title: '请在浏览器中打开',
    content:
      '点击确定复制网址，在浏览器中粘贴网址购买实体书《Docker 技术入门与实战》学习更多内容',
    success(res) {
      res.confirm &&
        wx.setClipboardData({
          data: 'https://u.jd.com/tKZmVG',
        });
    },
  });
}
