export default function dashang() {
  // wx.navigateTo({
  //   url: '/pages/donate/index',
  // });

  const url =
    'https://gitee.com/khs1994-docker/docker_practice/raw/master/docker_dashang.png';

  wx.showModal({
    title: '打赏',
    content: '点击打赏，长按图片选择『识别图中二维码』进行打赏',
    confirmText: '打赏',
    confirmColor: '#FF4500',
    cancelText: '我再想想',
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
