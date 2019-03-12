export default function style(noticeBGColor: string) {
  wx.getSystemInfo({
    success(res) {
      let version = res.version.split('.')[0];

      console.log(version);

      wx.setBackgroundColor({
        backgroundColor: noticeBGColor,
      });

      wx.setBackgroundTextStyle({
        textStyle: noticeBGColor === '#000000' ? 'light' : 'dark',
      });

      if (noticeBGColor === '#000000') {
        // 暗色模式
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: noticeBGColor,
          animation: {},
        });
      } else {
        // 亮色模式 '#ffffff'
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: noticeBGColor,
          animation: {},
        });
      }
    },
  });
}
