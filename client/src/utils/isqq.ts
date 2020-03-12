// @ts-ignore
const { AppPlatform: platform } = wx.getSystemInfoSync();

export default platform === 'qq';
