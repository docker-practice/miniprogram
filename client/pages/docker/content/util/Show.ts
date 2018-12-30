// 展示 markdown 数据

import { IMyApp } from '../../../../app';
const app = getApp<IMyApp>();

export default function show(
  isCache: boolean,
  key: string,
  MDData: any,
  fontType: string,
) {
  let data: any;

  if (isCache) {
    data = JSON.parse(wx.getStorageSync(key));
  } else {
    data = app.towxml.toJson(MDData, 'markdown');

    wx.setStorage({
      key,
      data: JSON.stringify(data),
    });
  }

  const theme = app.globalData.theme;
  data.theme = theme;
  data.fontType = fontType;
  // data.footer = true;
  // data.ad = false;
  // console.log(theme);

  // wx.setNavigationBarColor({
  //   backgroundColor: theme === 'dark' ? '#000000': '#ffffff',
  //   frontColor: theme === 'dark' ? '#ffffff': '#000000',
  //   animation: {},
  // });

  return data;
}
