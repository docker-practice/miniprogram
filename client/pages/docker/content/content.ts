import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();
import { next, before } from './next_page';

Page({
  data: {
    data: '',
    key: '',
    next_key: '',
    before_key: '',
    startX: '',
    startY: '',
    endX: '',
    endY: '',
    percent: 0,
    intervalNum: 0,
    progressColor: '#36a1f0',
  },
  onUnload() {
    app.globalData.MDData = '';
  },
  onLoad(options: any) {
    console.log('onload');
    this.load(options);
  },
  load(options: any) {
    wx.showNavigationBarLoading({});
    this.setData!({
      percent: 0,
      progressColor: '#36a1f0',
    });
    let time = 1;

    let intervalNum = setInterval(() => {
      // console.log(time);
      if (time > 48) {
        return;
      }
      this.setData!({
        percent: time++ * 2,
      });
    }, 20);

    let key = options.key;

    let next_key = next(key);
    let before_key = before(key);

    next_key = next_key ? next_key : '';
    before_key = before_key ? before_key : '';

    this.setData!({
      key,
      next_key,
      before_key,
      intervalNum,
    });

    console.log(before_key);
    console.log(key);
    console.log(next_key);

    this.request(key);
  },

  show() {
    const data = app.towxml.toJson(app.globalData.MDData, 'markdown');

    const theme = app.globalData.theme;

    data.theme = theme;

    this.setData!({
      data,
    });

    // wx.setNavigationBarColor({
    //   backgroundColor: theme === 'dark' ? '#000000': '#ffffff',
    //   frontColor: theme === 'dark' ? '#ffffff': '#000000',
    //   animation: {},
    // });

    setTimeout(() => {
      clearInterval(this.data.intervalNum);

      this.setData!({
        percent: 100,
        progressColor: '#fff',
      });

      wx.hideNavigationBarLoading({});
    }, 1000);

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 700,
    });
  },
  onShareAppMessage: function(): any {
    return {
      title: '开始 Docker 之旅~',
      path: '/pages/docker/index/index',
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
      success() {
        wx.showToast({
          title: '感谢支持',
        });
      },
      fail() {
        wx.showToast({
          title: '转发失败',
          icon: 'success',
        });
      },
    };
  },
  next() {
    const [, next_key] = <any>this.data.next_key;

    // wx.redirectTo({
    //   url: './content?key='+ next_key,
    // });
    this.load({ key: next_key });

    if (!next_key) {
      wx.showToast({
        title: '没有了',
      });
      return;
    }
  },
  before() {
    const [, before_key] = <any>this.data.before_key;

    if (!before_key) {
      wx.showToast({
        title: '没有了',
      });
      return;
    }

    // wx.redirectTo({
    //   url: './content?key='+ before_key,
    // });
    this.load({ key: before_key });
  },

  menu() {
    wx.switchTab({
      url: '../index/index',
    });
  },

  request(key: any) {
    if (key) {
      console.log(key);

      // @ts-ignore
      wx.reportAnalytics('pages', {
        page: key,
      });

      // let url = `https://ci.khs1994.com/proxy_github_raw/yeasy/docker_practice/master/${key}`;

      let url = `https://gitee.com/docker_practice/docker_practice/raw/master/${key}`;

      if (key === 'README.md') {
        // url = 'https://ci.khs1994.com/proxy_github_raw/khs1994-docker/docker_practice/master/README.md';
        url =
          'https://gitee.com/khs1994-docker/docker_practice/raw/master/README.md';
      }

      wx.request({
        url,
        success: (res: any) => {
          app.globalData.MDData = res.data;

          this.show();
        },
      });

      return;
    }
  },
  __bind_touchend() {
    // console.log('触摸结束');
    // console.log(res);
    // let endX= res.changedTouches[0].pageX;
    // let endY = res.changedTouches[0].pageY;
    //
    // let diff_y = endY - <any>this.data.startY;
    // let diff_x = endX - <any>this.data.startX;
    //
    // console.log(diff_x,diff_y);
    //
    // if(Math.abs(diff_y) > 10 ){
    //   return;
    // }
    //
    // diff_x > 40 && this.before();
    // diff_x < -40 && this.next();
  },
  __bind_touchstart() {
    // console.log('触摸开始');
    // console.log(res);
    // let startX=res.touches[0].pageX;
    // let startY = res.changedTouches[0].pageY;
    //
    // this.setData!({
    //   startX,
    //   startY,
    // });
  },

  __bind_touchmove() {
    // console.log('触摸中');
    // console.log(res);
  },

  __bind_tap() {},

  __bind_touchcancel() {},
});
