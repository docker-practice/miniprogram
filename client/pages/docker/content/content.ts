import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();
import { next, before } from './next_page';
// const MenuData = require('../index/summary.js');

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
    showMenu: false,
    MDData: '',
    folder: '',
    showNotice: true,
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
      showNotice: true,
    });
    // let time = 1;

    // let intervalNum = setInterval(() => {
    //   // console.log(time);
    //   if (time > 50) {
    //     return;
    //   }
    //   this.setData!({
    //     percent: time++ * 2,
    //   });
    // }, 20);

    let key = options.key;

    let next_key = next(key);
    let before_key = before(key);

    let folder = this.getFolder(key);

    this.setData!({
      folder,
    });

    next_key = next_key ? next_key : '';
    before_key = before_key ? before_key : '';

    this.setData!({
      key,
      next_key,
      before_key,
      // intervalNum,
    });

    console.log(before_key, key, next_key);

    this.request(key);
  },

  getFolder(key: string) {
    let key_array = key.split('/');
    let key_array_length = key_array.length;

    if (key_array_length === 1) {
      return '/';
    }

    key_array.length = key_array.length - 1;

    return key_array.join('/') + '/';
  },

  show() {
    const data = app.towxml.toJson(this.data.MDData, 'markdown');

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
      // clearInterval(this.data.intervalNum);

      // this.setData!({
      //   percent: 100,
      //   progressColor: '#fff',
      // });

      wx.hideNavigationBarLoading({});
    }, 1000);

    // setTimeout(()=>{
    //   this.setData!({
    //     showNotice: false,
    //   })
    // },10000);

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
  tabbar(res: any) {
    const key = res.detail.key;
    switch (key) {
      case 'next':
        this.next();
        break;
      case 'before':
        this.before();
        break;
      default:
        this.menu();
    }
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
    // this.setData!({
    //   MenuData,
    //   showMenu: true,
    // });

    wx.switchTab({
      url: '../index/index',
    });
  },

  menuClose() {
    this.setData!({
      showMenu: false,
    });
  },

  request(key: any) {
    if (!key) {
      return;
    }

    console.log(key);

    // @ts-ignore
    wx.reportAnalytics('pages', {
      page: key,
    });

    const base_url =
      'https://gitee.com/docker_practice/docker_practice/raw/master';

    // let url = `https://ci.khs1994.com/proxy_github_raw/yeasy/docker_practice/master/${key}`;

    let url = `${base_url}/${key}`;

    if (key === 'README.md') {
      // url = 'https://ci.khs1994.com/proxy_github_raw/khs1994-docker/docker_practice/master/README.md';
      url =
        'https://gitee.com/khs1994-docker/docker_practice/raw/master/README.md';
    }

    wx.request({
      url,
      success: (res: any) => {
        let MDData = res.data;

        async function requestImg(folder: string) {
          await new Promise((resolve, reject) => {
            wx.getNetworkType({
              success(res) {
                const networkType = res.networkType;

                if (networkType !== 'wifi') {
                  wx.showToast({
                    title: '无图模式',
                  });

                  reject('not wifi');
                }

                resolve(networkType);
              },
              fail(e) {
                reject(e);
              },
            });
          });

          let result = MDData.match(/\!\[.*?\)/g);

          if (result) {
            for (let item of result) {
              let img = item.split('(')[1].split(')')[0];
              let new_item = `![](${base_url}/${folder}${img})`;

              // console.log(item, new_item);
              MDData = MDData.replace(item, new_item);
            }
          }

          return MDData;
        }

        requestImg(this.data.folder)
          .then(MDData => {
            this.setData!({
              MDData,
            });

            this.show();
          })
          .catch(() => {
            this.setData!({
              MDData,
            });

            this.show();
          });
      },
      fail() {
        wx.showToast({
          title: '网络连接失败',
          icon: 'loading',
        });
      },
    });
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
