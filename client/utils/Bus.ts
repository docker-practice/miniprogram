export default function bus() {
  const url =
    'https://gitee.com/khs1994-docker/docker_practice/raw/master/bus.png';

  wx.showModal({
    title: '点击确定，长按图片选择『保存图片』',
    content: '保存之后在 『支付宝 APP』 扫一扫功能右上角选择图片进入活动',
    success(res) {
      res.confirm &&
        wx.previewImage({
          current: url,
          urls: [url],
        });
    },
  });
}
