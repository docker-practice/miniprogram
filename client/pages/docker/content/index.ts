import { IMyApp } from '../../../app';
const app = getApp<IMyApp>();

// const fs = wx.getFileSystemManager();

import { next, before } from './util/next_page';
// const MenuData = require('../index/summary.js');
import getFolder from './util/getFolder';
import Request from './util/Request';
import Style from './util/Style';
import Font from '../../../utils/Font';
import daShang from '../../../utils/DaShang';
import Ad from '../../../utils/Ad';
import openGithub from '../../../utils/OpenGithub';
import Cache from '../../../utils/Toolkit/Cache';

const cache = new Cache();
const ad = new Ad();

let interstitialAd: any;

function parsePath(href: string) {
  let arr: Array<string | null> = href.split('/');

  while (true) {
    let index = arr.indexOf('..');
    if (index === -1) {
      break;
    }

    arr[index] = null;
    arr[index - 1] = null;
    // remove null
    arr = arr.filter(d => d);
  }

  return arr.join('/');
}

Page({
  data: {
    data: '',
    key: '',
    next_key: '',
    before_key: '',
    // startX: '',
    // startY: '',
    // endX: '',
    // endY: '',
    // progressColor: '#36a1f0',
    // showMenu: false,
    MDData: '',
    folder: '',
    showNotice: true,
    noticeBGColor: '#fff',
    tabbarMode: 'light',
    // lazy: true,
    theme: 'light',
    statusBarHeight: 0,
    // spinShow: false,
    show: false,
    hideFirst: true,
    showFixedStatusBar: false,
    fontType: '默认',
    showAd: true,
  },

  onUnload() {
    // app.globalData.MDData = '';
  },

  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中...',
    });

    this.setData!({
      hideFirst: false,
    });

    this.request(this.data.key, false);

    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, 2000);
  },

  onLoad(options: any) {
    // console.log('onload');
    wx.showLoading({
      title: '加载中...',
    });

    wx.onNetworkStatusChange(res => {
      wx.showToast({
        title: `${res.networkType.toUpperCase()} 已连接`,
        icon: 'none',
        duration: 1500,
      });
    });

    const theme: any = app.globalData.theme;
    const noticeBGColor = theme === 'dark' ? '#000000' : '#ffffff';

    // 获取状态栏（信号栏）高度
    wx.getSystemInfo({
      success: res => {
        // res.version.split('.')[0] === '6';

        this.setData!({
          showFixedStatusBar: true,
          statusBarHeight: res.statusBarHeight,
        });
      },
    });

    Style(noticeBGColor);

    // 设置字体
    const fontType = app.globalData.fontType;
    new Font().force(fontType);

    this.setData!({
      // percent: 0,
      // progressColor: '#36a1f0',
      // showNotice: true,
      noticeBGColor,
      tabbarMode: theme,
      theme,
      fontType,
    });

    this.load(options);

    if (wx.getSystemInfoSync().platform === 'devtools') {
      return;
    }

    // 插屏广告
    // @ts-ignore
    if (wx.createInterstitialAd) {
      // @ts-ignore
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-6ef44789d84b9392',
      });

      setTimeout(async () => {
        if (await cache.exists('ad/show')) {
          console.log('==> 1 hour not show ad');
          return;
        }

        interstitialAd.show().then(
          () => {
            // 展示成功
            cache.set('ad/show', '', 3600);
          },
          (err: any) => {
            console.log('==>content ', err);
          },
        );
      }, 15000);

      interstitialAd.onClose(() => {});

      interstitialAd.onError((res: any) => {
        console.log('==>content ', res);
      });

      interstitialAd.onLoad(() => {
        console.log('==>content on load event');
      });
    }
  },

  // 分享按钮
  onShareAppMessage() {
    return {
      title: '开始 Docker 之旅~',
      path: '/pages/docker/content/index?key=' + this.data.key,
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

  // 系统事件 end

  // 处理加载事件
  load(options: any, requestFirst: boolean = false) {
    const key = options.key;

    let [folder, next_key, before_key] = [
      getFolder(key),
      next(key),
      before(key),
    ];

    next_key = next_key ? next_key : '';
    before_key = before_key ? before_key : '';

    // console.log(before_key, key, next_key);
    // 跳页时先进行网络请求，若成功再赋值
    if (requestFirst) {
      this.request(key)
        .then(() => {
          this.setData!({
            folder,
            key,
            next_key,
            before_key,
          });
        })
        .catch(() => {
          // 首次进入，网络连接错误数据为空
          let show = this.data.MDData ? true : false;

          this.setData!({
            showAd: true,
            show,
          });

          setTimeout(() => {
            wx.showToast({
              icon: 'loading',
              title: '网络连接错误',
              duration: 1000,
            });
          }, 800);
        });

      return;
    }
    // 首次进入，先赋值，再请求

    this.setData!({
      folder,
      key,
      next_key,
      before_key,
    });

    this.request(key).then(
      () => {},
      () => {
        this.setData!({
          // showAd: false,
          show: false,
        });

        wx.hideLoading();

        wx.showModal({
          title: '网络连接错误',
          content: '',
          showCancel: false,
          // complete: ()=>{
          //   wx.navigateBack({
          //     delta: 1,
          //   });
          // },
        });
      },
    );
  },

  async request(key: any, useCache: boolean = true) {
    if (!key) {
      return;
    }

    if (useCache && (await cache.exists('book/' + key))) {
      this.show(key, true);

      return;
    }

    // 上传分析数据
    wx.reportAnalytics('pages', {
      // @ts-ignore
      page: key,
    });

    const baseUrl = app.globalData.baseUrl;

    return new Request()
      .create(key, baseUrl, this.data.folder)
      .then((MDData: any) => {
        this.setData!({
          MDData,
        });
        this.show(key);
      })
      .catch(() => {
        // 网络连接错误
        return Promise.reject();
      });
  },

  async show(key: string, isCache: boolean = false) {
    let data: any;

    if (isCache) {
      try {
        data = await cache.get('book/' + key);
      } catch {
        data = app.towxml.toJson(this.data.MDData, 'markdown');
      }
    } else {
      data = app.towxml.toJson(this.data.MDData, 'markdown');

      cache.set('book/' + key, data);
    }

    data.theme = app.globalData.theme;
    data.fontType = this.data.fontType;

    this.data.hideFirst &&
      this.setData!({
        // @ts-ignore
        data: {},
      });

    setTimeout(() => {
      this.setData!({
        // spinShow: false, // 去掉加载动画
        data,
        showAd: true,
        show: true,
        hideFirst: true,
      });
    }, 500);

    setTimeout(() => {
      wx.hideLoading();
    }, 1500);

    // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0,
      // duration: 1000,
    });
  },

  // tabbar 点击事件处理函数
  tabbar(res: any) {
    const key = res.detail.key;

    if (key === 'next' || key === 'before') {
      this.jump(key);

      return;
    }

    this.menu();
  },

  // 跳页
  jump(type = 'next') {
    wx.showLoading({
      title: '加载中...',
    });

    const [, key] =
      type === 'next' ? <any>this.data.next_key : <any>this.data.before_key;

    // 隐藏广告 功能按钮
    this.setData!({
      // spinShow: true,
      showAd: false,
      show: false, // 隐藏
    });

    this.load({ key }, true);
  },

  menu() {
    // this.setData!({
    //   MenuData,
    //   showMenu: true,
    // });

    if (getCurrentPages().length === 1) {
      wx.switchTab({
        url: '/pages/docker/summary/index',
      });

      return;
    }

    wx.navigateBack({ delta: 1 });

    // wx.switchTab({
    //   url: '../summary/index',
    // });
  },

  // menuClose() {
  //   this.setData!({
  //     showMenu: false,
  //   });
  // },

  pushNote() {
    wx.navigateTo({
      url: '../../note/index?key=' + this.data.key,
    });
  },

  adError() {
    this.setData!({
      showAd: false,
    });
  },

  favorites() {
    wx.showModal({
      title: '即将支持',
      content: '敬请期待',
      showCancel: false,
    });
  },

  dashang() {
    daShang();
  },

  buyBook() {
    ad.buyBook();
  },

  openGithub() {
    openGithub();
  },

  // towxml 事件

  __bind_touchend() {
    // console.log('触摸结束' + res);
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
    // console.log('触摸开始' + res);
    // let startX=res.touches[0].pageX;
    // let startY = res.changedTouches[0].pageY;
    //
    // this.setData!({
    //   startX,
    //   startY,
    // });
  },

  __bind_touchmove() {
    // console.log('触摸中' + res);
  },

  __bind_tap(res: any) {
    console.log(res);
    let href = res.currentTarget.dataset._el.attr.href || '';

    if (href === '' || !href.match(/.md$/g)) {
      return;
    }

    const folder = this.data.folder;

    href = folder === '/' ? href : folder + href;

    if (href.match(/../g)) {
      console.log(href);
      href = parsePath(href);
    }

    wx.navigateTo({
      url: 'index?key=' + href,
    });
  },

  __bind_touchcancel() {},
});
