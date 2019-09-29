export default function openGithub() {
  wx.showModal({
    title: 'GitHub',
    content: '您可以在小程序中查看详情，也可以复制网址在浏览器打开',
    confirmText: '复制网址',
    cancelText: '查看详情',
    success(res) {
      if (res.confirm) {
        wx.setClipboardData({
          data: 'https://github.com/yeasy/docker_practice',
        });

        return;
      }

      wx.navigateToMiniProgram({
        appId: 'wx5d7793555064ce62',
        path: 'pages/repo-detail/repo-detail?repo=yeasy/docker_practice',
      });
    },
  });
}
