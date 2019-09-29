export default function test() {
  if (wx.getSystemInfoSync().platform === 'devtools') {
    // @ts-ignore
    const Cachetest = require('./CacheTest');
    // @ts-ignore
    const Timetest = require('./TimeTest');
  }
}
