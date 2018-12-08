import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();

Page({
  data: {
    data: '',
  },

  onLoad() {
    const data = app.towxml.toJson(app.globalData.MDData, 'markdown');

    data.theme = 'light';

    this.setData!({
      data,
    });
  },
});
