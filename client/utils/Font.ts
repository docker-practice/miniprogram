export default class Font {
  force(fontType: string) {
    new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          if (res.networkType === 'wifi') {
            resolve('wifi');
          }

          reject('not wifi');
        },
      }); // end
    })
      .then(() => {
        if (fontType === 'ZCOOL KuaiLe') {
          wx.loadFontFace({
            family: 'ZCOOL KuaiLe',
            source:
              'url("https://code.aliyun.com/khs1994/fonts/raw/34ad673bb038d4e512616096cca74dd52d45b39d/ZCOOLKuaiLe-Regular.ttf")',
            success(e) {
              wx.showToast({
                title: '字体加载成功',
                icon: 'success',
              });
              console.log(e);
            },
            fail(e) {
              wx.showToast({
                title: '字体加载失败',
                icon: 'none',
              });
              console.log(e);
            },
          });

          return;
        }
      })
      .catch(() => {
        wx.showToast({
          title: '非 WiFi 网络下不加载自定义字体',
          icon: 'none',
          duration: 1000,
        });
      }); // then end
  } // force end
}
