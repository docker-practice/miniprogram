export default function dashang() {
  const url =
    'https://gitee.com/khs1994-docker/docker_practice/raw/master/docker_dashang.png';

  wx.showModal({
    title: '点击打赏，长按图片选择『识别图中二维码』进行打赏',
    content: '感谢您的支持',
    confirmText: '打赏',
    confirmColor: '#FF4500',
    cancelText: '我再看看',
    success(res) {
      res.confirm &&
        wx.previewImage({
          current: url,
          urls: [url],
        });
    },
  });

  // wx.navigateToMiniProgram({
  //   appId: 'wx18a2ac992306a5a4',
  //   path: 'pages/apps/largess/detail?id=dhS32KPVsgs%3D',
  // });
}
