//logs.js
import Time from '../../utils/Toolkit/Time';

let time = new Time();

Page({
  data: {
    logs: [] as string[],
  },
  onLoad() {
    this.setData!({
      logs: (wx.getStorageSync('logs') || []).map((log: number) => {
        return time.format(new Date(log));
      }),
    });
  },
});
