import { IMyApp } from '../../../app';
const app = getApp<IMyApp>();

// const fs = wx.getFileSystemManager();

import { next, before } from './util/next_page';
// const MenuData = require('../index/summary.js');
import getFolder from './util/getFolder';
import Request from './util/Request';
import Show from './util/Show';
import Style from './util/Style';
import Font from '../../../utils/Font';

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
    // percent: 0,
    // intervalNum: 0,
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
    this.setData!({
      hideFirst: false,
    });

    this.request(this.data.key, false);

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 2000);
  },

  onLoad(options: any) {
    // console.log('onload');
    // 设置字体
    const fontType = app.globalData.fontType;
    new Font().force(fontType);

    this.load(options);
  },

  // 分享按钮
  onShareAppMessage() {
    return {
      title: '开始 Docker 之旅~',
      path: '/pages/docker/summary/index',
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
  load(options: any) {
    const theme: any = app.globalData.theme;
    const noticeBGColor = theme === 'dark' ? '#000000' : '#ffffff';

    // 设置字体
    const fontType = app.globalData.fontType;

    // 获取状态栏（信号栏）高度
    wx.getSystemInfo({
      success: res => {
        if (res.version.split('.')[0] === '6') {
          return;
        }

        this.setData!({
          showFixedStatusBar: true,
          statusBarHeight: res.statusBarHeight,
        });
      },
    });

    Style(noticeBGColor);

    const key = options.key;
    const folder = getFolder(key);
    let next_key = next(key);
    let before_key = before(key);

    next_key = next_key ? next_key : '';
    before_key = before_key ? before_key : '';

    // console.log(before_key, key, next_key);

    this.setData!({
      // percent: 0,
      // progressColor: '#36a1f0',
      // showNotice: true,
      noticeBGColor,
      tabbarMode: theme,
      theme,
      folder,
      key,
      next_key,
      before_key,
      fontType,
    });

    this.request(key);
  },

  show(key: string, isCache: boolean = false) {
    const fontType = this.data.fontType;
    let data = Show(isCache, key, this.data.MDData, fontType);

    this.data.hideFirst &&
      this.setData!({
        // @ts-ignore
        data: {},
      });

    setTimeout(() => {
      // clearInterval(this.data.intervalNum);

      this.setData!({
        // 去掉加载动画
        // spinShow: false,
        data,
        show: true,
        hideFirst: true,
      });

      wx.hideLoading();
    }, 500);

    // 返回顶部
    wx.pageScrollTo({
      scrollTop: 0,
      // duration: 1000,
    });
  },

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

    this.setData!({
      showAd: false,
    });

    const [, jump_key] =
      type === 'next' ? <any>this.data.next_key : <any>this.data.before_key;

    this.setData!({
      // spinShow: true,
      show: false, // 隐藏
    });

    this.load({ key: jump_key });

    setTimeout(() => {
      // wx.hideLoading();

      this.setData!({
        showAd: true,
      });
    }, 100);

    if (!jump_key) {
      wx.showToast({
        title: '没有了',
      });
      return;
    }
  },

  menu() {
    // this.setData!({
    //   MenuData,
    //   showMenu: true,
    // });

    wx.switchTab({
      url: '../summary/index',
    });
  },

  // menuClose() {
  //   this.setData!({
  //     showMenu: false,
  //   });
  // },

  request(key: any, cache: boolean = true) {
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

    new Request()
      .create(key, baseUrl, this.data.folder)
      .then((MDData: any) => {
        this.setData!({
          MDData,
        });

        this.show(key);
      })
      .catch(MDData => {
        this.setData!({
          MDData,
        });

        this.show(key);
      });
  },

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
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=dhS32KPVsgs%3D',
    });
  },

  buyBook() {
    wx.showModal({
      title: '请在浏览器中打开',
      content:
        '点击确定复制网址，在浏览器中粘贴地址购买实体书《Docker 技术入门与实战》学习更多内容',
      success(res) {
        res.confirm &&
          wx.setClipboardData({
            data: 'https://u.jd.com/tKZmVG',
          });
      },
    });
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
