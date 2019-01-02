import { IMyApp } from '../../../app';
const app = getApp<IMyApp>();

const fs = wx.getFileSystemManager();

import { next, before } from './util/next_page';
// const MenuData = require('../index/summary.js');
import getFolder from './util/getFolder';
import Token from './util/Token';
import Issue from './util/Issue';
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
    note: '',
    noteTitle: '',
    textareaValue: '',
    textareaTitleValue: '',
    isLoading: false,
    statusBarHeight: 0,
    // spinShow: false,
    show: false,
    hideFirst: true,
    showFixedStatusBar: false,
    fontType: '默认',
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

    // 加载中
    wx.showNavigationBarLoading();

    const key = options.key;
    const folder = getFolder(key);
    let next_key = next(key);
    let before_key = before(key);

    next_key = next_key ? next_key : '';
    before_key = before_key ? before_key : '';

    // console.log(before_key, key, next_key);

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

      // this.setData!({
      //   percent: 100,
      //   progressColor: '#fff',
      // });

      wx.hideNavigationBarLoading();

      this.setData!({
        // 去掉加载动画
        // spinShow: false,
        data,
        show: true,
        hideFirst: true,
      });
    }, 500);

    // setTimeout(()=>{
    //   this.setData!({
    //     showNotice: false,
    //   })
    // },10000);

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
    const [, jump_key] =
      type === 'next' ? <any>this.data.next_key : <any>this.data.before_key;

    this.setData!({
      // spinShow: true,
      show: false, // 隐藏
    });

    this.load({ key: jump_key });

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
      url: '../index/index',
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

    // console.log(key);

    // wx.getStorageInfo({
    //   success(res) {
    //     console.log(res);
    //   },
    // });

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

  // 评论内容
  inputNote(res: any) {
    // this.checkToken();

    this.setData!({
      note: res.detail.value,
    });
  },

  // 评论标题
  inputNoteTitle(res: any) {
    this.setData!({
      noteTitle: res.detail.value,
    });
  },

  // 提交评论
  pushNote() {
    // 检查 token
    new Token().check();

    const note = this.data.note;
    const noteTitle = this.data.noteTitle;

    if (!note || !noteTitle) {
      wx.showToast({
        title: '请输入标题及内容',
        icon: 'none',
      });

      return;
    }

    this.setData!({
      isLoading: true,
    });

    wx.showModal({
      title: noteTitle,
      content: note,
      showCancel: false,
    });

    const token = fs.readFileSync(`${wx.env.USER_DATA_PATH}/token`, 'base64');

    // console.log(token);

    // 提交 issue
    new Issue()
      .create(this.data.key, note, noteTitle, token)
      .then(() => {
        this.setData!({
          textareaValue: '',
          textareaTitleValue: '',
          note: '',
          noteTitle: '',
        });
      })
      // @ts-ignore
      .finally(() => {
        this.setData!({
          isLoading: false,
        });
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
