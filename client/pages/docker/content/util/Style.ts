export default function style(noticeBGColor: string) {
  wx.getSystemInfo({
    success(res) {
      let version = res.version.split('.')[0];

      if (version === '7') {
        wx.setBackgroundColor({
          backgroundColor: noticeBGColor,
        });

        if (noticeBGColor === '#000000') {
          // 暗色模式
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: noticeBGColor,
            animation: {},
          });
        } else {
          // 亮色模式
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: noticeBGColor,
            animation: {},
          });
        }

        return;
      }
      // version 7 end
      if (noticeBGColor === '#000000') {
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: noticeBGColor,
          animation: {},
        });

        wx.setBackgroundColor({
          backgroundColor: noticeBGColor,
        });
      }
    }, // success end
  });
}
