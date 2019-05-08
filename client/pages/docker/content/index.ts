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
import buyBook from '../../../utils/BuyBook';
import openGithub from '../../../utils/OpenGithub';

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
          this.setData!({
            showAd: true,
            show: true,
          });

          wx.showToast({
            icon: 'loading',
            title: '网络连接错误',
            duration: 1000,
          });
        });

      return;
    }

    this.setData!({
      folder,
      key,
      next_key,
      before_key,
    });

    this.request(key);
  },

  async request(key: any, cache: boolean = true) {
    if (!key) {
      return;
    }

    if (cache && wx.getStorageSync(key)) {
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

  show(key: string, isCache: boolean = false) {
    let data: any;

    if (isCache) {
      data = JSON.parse(wx.getStorageSync(key));
    } else {
      data = app.towxml.toJson(this.data.MDData, 'markdown');

      wx.setStorage({
        key,
        data: JSON.stringify(data),
      });
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
      title: '加载中',
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
    buyBook();
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

  __bind_tap() {},

  __bind_touchcancel() {},
});
