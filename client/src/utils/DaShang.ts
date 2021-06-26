export default function dashang() {
  // wx.navigateTo({
  //   url: '/pages/donate/index',
  // });

  const url =
    // 'https://gitee.com/khs1994-docker/docker_practice/raw/master/docker_dashang.png';
    'https://dpsigs.coding.net/p/docker_practice/d/docker-practice.com/git/raw/master/wechat.jpg';

  wx.showModal({
    title: '加入微信群聊',
    content: '点击加入，长按图片选择『打开对方的名片』添加小助手微信',
    confirmText: '加入',
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
