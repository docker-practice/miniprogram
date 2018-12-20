import { IMyApp } from '../../../app';

const app = getApp<IMyApp>();
import { next, before } from './next_page';
// const MenuData = require('../index/summary.js');

const fs = wx.getFileSystemManager();

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
    noticeBGColor: '#fff',
    tabbarMode: 'light',
    lazy: true,
    theme: 'light',
    note: '',
    noteTitle: '',
    textareaValue: '',
    textareaTitleValue: '',
    isLoading: false,
  },
  onUnload() {
    app.globalData.MDData = '';
  },
  onLoad(options: any) {
    console.log('onload');
    this.load(options);
  },
  onPullDownRefresh() {
    this.request(this.data.key, false);

    setTimeout(() => wx.stopPullDownRefresh({}), 2000);
  },
  load(options: any) {
    let theme: any = app.globalData.theme;

    const noticeBGColor = theme === 'dark' ? '#000000' : '#ffffff';

    if (noticeBGColor === '#000000') {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: noticeBGColor,
        animation: {},
      });

      wx.setBackgroundColor({
        backgroundColor: noticeBGColor,
      });
    }

    wx.showNavigationBarLoading({});
    this.setData!({
      percent: 0,
      progressColor: '#36a1f0',
      showNotice: true,
      noticeBGColor,
      tabbarMode: theme,
      theme,
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

    let folder = this.getFolder(key);

    this.setData!({
      folder,
    });

    let next_key = next(key);
    let before_key = before(key);

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

  show(key: string, isCache: boolean = false) {
    let data;

    if (isCache) {
      data = JSON.parse(wx.getStorageSync(key));
    } else {
      data = app.towxml.toJson(this.data.MDData, 'markdown');

      wx.setStorage({
        key,
        data: JSON.stringify(data),
      });
    }

    const theme = app.globalData.theme;
    data.theme = theme;
    data.footer = true;
    data.ad = false;
    console.log(theme);

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

  request(key: any, cache: boolean = true) {
    if (!key) {
      return;
    }

    console.log(key);

    wx.getStorageInfo({
      success(res) {
        console.log(res);
      },
    });

    if (cache && wx.getStorageSync(key)) {
      this.show(key, true);

      return;
    }

    // @ts-ignore
    wx.reportAnalytics('pages', {
      page: key,
    });

    // const base_url = 'https://gitee.com/docker_practice/docker_practice/raw/master';

    const base_url = app.globalData.baseUrl;

    // let url = `https://ci.khs1994.com/proxy_github_raw/yeasy/docker_practice/master/${key}`;

    let url = `${base_url}/${key}`;

    if (key === 'README.md' || key === 'miniprogram.md') {
      // url = 'https://ci.khs1994.com/proxy_github_raw/khs1994-docker/docker_practice/master/README.md';
      url = `https://gitee.com/khs1994-docker/docker_practice/raw/master/${key}`;
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

                // if (networkType !== 'wifi') {
                //   wx.showToast({
                //     title: '无图模式',
                //   });
                //
                //   reject('not wifi');
                // }

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

            this.show(key);
          })
          .catch(() => {
            this.setData!({
              MDData,
            });

            this.show(key);
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
  adError(e: any) {
    console.log(e);
  },
  adSuccess(res: any) {
    console.log(res);
  },
  inputNote(res: any) {
    // this.checkToken();

    this.setData!({
      note: res.detail.value,
    });
  },
  inputNoteTitle(res: any) {
    // this.checkToken();

    this.setData!({
      noteTitle: res.detail.value,
    });
  },
  checkToken() {
    let token;
    try {
      token = fs.readFileSync(`${wx.env.USER_DATA_PATH}/token`, 'base64');
    } catch (e) {
      token = '';
    }
    if (!token) {
      wx.showModal({
        title: '未登录 GitHub',
        content: '点击确定登录 GitHub 账户',
        success: (res: any) => {
          res.confirm === true &&
            wx.navigateTo({
              url: '/pages/login/index',
            });
        },
      });

      throw new Error('login first');
    }
  },
  // 提交 issue
  pushNote() {
    this.checkToken();

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

    // const repo = 'khs1994/docker_practice_miniprogram';
    const repo = 'yeasy/docker_practice';

    const token = fs.readFileSync(`${wx.env.USER_DATA_PATH}/token`, 'base64');

    // console.log(token);

    wx.request({
      url: 'https://ci.khs1994.com/proxy_github_api/repos/' + repo + '/issues',
      method: 'POST',
      data: {
        title: noteTitle,
        body:
          note +
          '\n' +
          `

## This issue from docker_practice miniprogram

> [${this.data.key}](https://github.com/yeasy/docker_practice/blob/master/${
            this.data.key
          })
`,
      },
      header: {
        Authorization: 'Basic ' + token,
      },
      success: (res: any) => {
        if (res.statusCode !== 201) {
          this.pushNodeError(res);

          return;
        }

        wx.showModal({
          title: '提交成功',
          content: '请登录 GitHub 查看最新回复',
          showCancel: false,
          success: () => {
            this.setData!({
              textareaValue: '',
              textareaTitleValue: '',
              note: '',
              noteTitle: '',
            });
          },
        });
      },
      fail: (e: any) => {
        this.pushNodeError(e);
      },
      complete: () => {
        this.setData!({
          isLoading: false,
        });
      },
    });
  },
  // 提交 note 出现错误
  pushNodeError(e: any) {
    wx.showModal({
      title: '提交失败',
      content: JSON.stringify(e),
      showCancel: false,
    });
  },
});
