export default function alipay() {
  const extra = '';
  // new Date().getMonth() === 2
  //   ? '3 月还可参加瓜分 9 亿活动，支付宝搜索『9亿』参加活动'
  //   : '';

  wx.showModal({
    title: '点击确定，复制搜索码',
    content: '在 『支付宝 APP』顶部搜索框粘贴内容领取红包。' + extra,
    success(res) {
      res.confirm &&
        wx.setClipboardData({
          data:
            '打开支付宝首页搜“650310146”领红包，领到大红包的小伙伴赶紧使用哦！',
        });
    },
  });
}
