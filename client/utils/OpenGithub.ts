export default function openGithub() {
  wx.showModal({
    title: '请在浏览器打开',
    content: '点击确定复制网址，在浏览器中打开项目 GitHub',
    success(res) {
      res.confirm &&
        wx.setClipboardData({
          data: 'https://github.com/yeasy/docker_practice',
        });
    },
  });
}
