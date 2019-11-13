import { IMyApp } from '../../../app';
import {
  next,
  before,
} from '../../../src/Framework/src/Support/Summary/next_page';
import getFolder from '../../../src/Framework/src/Support/Summary/getFolder';
import Request from './Request';
import Style from './Style';
import Font from '../../../src/utils/Font';
import daShang from '../../../src/utils/DaShang';
import Ad from '../../../src/utils/Ad';
import openGithub from '../../../src/utils/OpenGithub';
import Cache from '../../../src/Framework/src/Support/Cache';
import { isSign, uploadAdError } from '../../../src/utils/Qiandao';

const app = getApp<IMyApp>();
const cache = new Cache();
const ad = new Ad();

wx.onNetworkStatusChange(res => {
  wx.showToast({
    title: `${res.networkType.toUpperCase()} 已连接`,
    icon: 'none',
    duration: 1500,
  });
});

Page({
  data: {
    data: '',
    key: '',
    next_key: ['title', 'path'],
    before_key: ['title', 'path'],
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
    ad: ['adunit-3ea71b7cfce6c721', 'adunit-1246f0a5e441ea4c'],
    useWemark: false,
    wemarkType: 'rich-text',
    cache: true,
    wxMarkdownRichtext: true,
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
      cache: false,
    });

    this.request(this.data.key, false);

    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, 2000);
  },

  async onLoad(options: any) {
    // console.log('onload');

    wx.showLoading({
      title: '加载中...',
    });

    const theme: any = app.globalData.theme || 'light';
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

    let mdEngine = await cache.get('system/md-engine');
    let useWemark = false;
    let wemarkType = 'rich-text';
    let wxMarkdownRichtext = true;

    if (mdEngine === 'wemark') {
      useWemark = true;
      wemarkType = 'wemark';
    } else if (mdEngine === 'wemark-richtext') {
      useWemark = true;
    } else if (mdEngine === 'wx-markdown') {
      wxMarkdownRichtext = false;
    }

    this.setData!({
      // percent: 0,
      // progressColor: '#36a1f0',
      // showNotice: true,
      noticeBGColor,
      tabbarMode: theme,
      theme,
      fontType,
      useWemark,
      wemarkType,
      wxMarkdownRichtext,
    });

    this.load(options);

    // if (wx.getSystemInfoSync().platform === 'devtools') {
    //   return;
    // }

    // 插屏广告
    if (wx.createInterstitialAd) {
      let interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-6ef44789d84b9392',
      });

      console.log(interstitialAd);

      setTimeout(async () => {
        if (await cache.exists('ad/show')) {
          console.log("==> 10 mins don't show ad");
          return;
        }

        interstitialAd.show().then(
          () => {
            // 展示成功
            cache.set('ad/show', '', 10 * 60);
          },
          (err: any) => {
            console.log('==>content ', err);
            uploadAdError(err);
          },
        );
      }, 15000);

      interstitialAd.onClose(() => {});

      interstitialAd.onError((err: any) => {
        console.log('==>content ', err);
        uploadAdError(err);
      });

      interstitialAd.onLoad(() => {
        console.log('==>content on load event');
      });
    }

    if (options.pro === '1') {
      console.log('this is pro content');

      let isSigned = await isSign('', true);
      isSigned ? console.log('is sign') : console.log('unsign');

      if (!isSigned) {
        wx.showModal({
          title: '提示',
          content: '请到首页解锁进阶内容',
          showCancel: false,
          success: () => {
            wx.switchTab({
              url: '/pages/docker/summary/index',
            });
          },
        });

        return;
      }
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
  async load(options: any, requestFirst: boolean = false) {
    const key = options.key;

    let [folder, next_key, before_key] = [
      getFolder(key),
      await next(key),
      await before(key),
    ];

    next_key = next_key ? next_key : [];
    before_key = before_key ? before_key : [];

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

    if (useCache && (await cache.exists('book/markdown/' + key))) {
      console.log('md source data cached');
      this.show(key, true);

      return;
    }

    // 上传分析数据
    // wx.reportAnalytics('pages', {
    //   // @ts-ignore
    //   page: key,
    // });

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
      data = await cache.get('book/markdown/' + key);
    } else {
      data = this.data.MDData;

      await cache.set('book/markdown/' + key, data);
    }

    this.data.hideFirst &&
      this.setData!({
        // @ts-ignore
        data: '',
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
      cache: true,
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

  adError(res: any) {
    this.setData!({
      showAd: false,
    });

    uploadAdError(res.detail);
  },

  favorites() {
    wx.showModal({
      title: '敬请期待',
      content: '',
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
});
