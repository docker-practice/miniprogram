//import { IMyApp } from '../../../app';
//const app = getApp<IMyApp>();

import daShang from '../../../src/utils/DaShang';
import openGithub from '../../../src/utils/OpenGithub';
import qiandao from '../../../src/utils/Qiandao';
import { isSign, uploadAdError } from '../../../src/utils/Qiandao';
//import Ad from '../../../src/utils/Ad';
import DB from '../../../src/Framework/src/Support/DB';
// import Cloud from '../../../src/Framework/src/Support/Cloud';

//const ad = new Ad();
const db = DB.getInstance();
// const cloud = Cloud.getInstance();

// test
import test from '../../../src/Framework/test/index';
test();

// worker
// let worker = wx.createWorker('workers/test/index.js');
//
// worker.postMessage({
//   msg: 'main message',
// });
//
// worker.onMessage(res => {
//   console.log(res);
// });
//
// worker.terminate();

let videAd: any;
let interstitialAd: any;

import getSummary from '../../../src/utils/getSummary';
import isqq from '../../../src/utils/isqq';

let isHide = false;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: '',
        name: '',
        open: false,
      },
    ],
    isqq,
    showAd: true,
    theme: 'white',
    noticeMessage:
      '《Docker 技术入门与实战》第三版已经面世，介绍最新的容器技术栈，欢迎大家阅读使用并反馈建议。',
  },

  kindToggle: function (e: any) {
    let id = e.currentTarget.id;
    let list: any = this.data.list;

    if (id === 'subscribeMessage') {
      const tmplId = 'Frzqb0OUmqebNle3KJtrGN-X1M26ezf-5Bbpx9cBwp4';

      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success(res: any) {
          console.log(res);

          if (res[tmplId] !== 'accept') {
            wx.showModal({
              title: '订阅失败',
              content: JSON.stringify(res),
              showCancel: false,
            });

            return;
          }

          wx.cloud
            .callFunction({
              name: 'subscribeMessage',
              data: {
                addOpenId: 1,
              },
            })
            .then(
              (res) => {
                console.log(res);
              },
              (e) => {
                console.log(e);
              },
            );

          wx.showModal({
            title: '订阅成功',
            content: '',
            showCancel: false,
          });
        },
        fail(e: any) {
          console.log(e);
        },
      });
      return;
    }

    if (id === 'dashang') {
      this.dashang();
      return;
    }

    if (id === 'chengxin') {
      const imgUrl = 'https://dpsigs.coding.net/p/docker_practice/d/docker-practice.com/git/raw/master/chengxin.png';
      wx.navigateTo({
        url: `/pages/random/index?imgUrl=${imgUrl}`
      });
      return;
    }

    if (id === 'github') {
      this.github();
      return;
    }

    if (id == 'bus' || id === 'ad' || id === 'yuebao') {
      this.ad(id);
      return;
    }

    if (id === 'news') {
      wx.navigateTo({ url: '/pages/news/index' });
      return;
    }

    if (id === 'oldmenu') {
      wx.navigateTo({
        url: '/pages/docker/index/index',
      });
      return;
    }

    if (id === 'unsign') {
      this.qiandao();
      return;
    }

    if (id === 'sign') {
      wx.showModal({
        title: '提示',
        content: '已解锁进阶内容',
        showCancel: false,
      });
      return;
    }

    if (id === 'miniProgram') {
      wx.navigateTo({
        url: '../content/index?key=miniprogram.md',
      });

      return;
    }

    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open;
      } else {
        list[i].open = false;
      }
    }
    this.setData!({
      list: list,
    });
  },

  adError(res: any) {
    uploadAdError(res.detail);
  },

  openGithub() {
    openGithub();
  },

  dashang() {
    daShang();
  },

  github() {
    openGithub();
  },

  buyBook() {
    wx.navigateTo({
      url: '../../book/index',
    });
  },

  ad(id: string) {
    if (id === 'bus') {
      // ad.bus();
      return;
    }

    // wx.showModal({
    //   title: '请发电子邮件洽谈',
    //   content: 'docker@khs1994.com',
    //   showCancel: false,
    // });
    this.buyBook();
  },

  async isSign(local: boolean = false) {
    let list: any = this.data.list;

    isSign('', local).then((res) => {
      res &&
        (list[0] = {
          id: 'sign',
          name: '进阶内容已解锁',
        });

      this.setData!({
        // @ts-ignore
        list,
      });
    });

    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    let list = JSON.parse(await getSummary('list', false));

    this.setData!({
      // @ts-ignore
      list,
      // @ts-ignore
      theme: wx.getSystemInfoSync().theme,
    });

    // 获取通知消息
    db.collection('noticeMessage')
      .doc('noticeMessage')
      .get()
      .then(
        (res: any) => {
          let noticeMessage;

          if ((noticeMessage = res.data.message)) {
            this.setData!({
              noticeMessage,
            });
          }
        },
        (e) => {
          console.log(e);
        },
      );

    this.isSign(true);

    // if (wx.getSystemInfoSync().platform === 'devtools') {
    //   return;
    // }

    // 激励广告
    if (wx.createRewardedVideoAd) {
      videAd = wx.createRewardedVideoAd({
        adUnitId: isqq
          ? '823e0c24a1987ed2fdfdeefcc8883c7c'
          : 'adunit-a929f1a7fb4e4e96',
      });

      videAd.onError((err: any) => {
        wx.showModal({
          title: '提示',
          content: JSON.stringify(err),
          showCancel: false,
        });

        uploadAdError(err);
      });

      videAd.onClose(() => {
        setTimeout(() => {
          this.isSign(false);
        }, 2000);
      });
    }

    // 插屏广告
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: isqq
          ? 'b9b0567ae11780a9f7886b61683c1ae2'
          : 'adunit-6ef44789d84b9392',
      });

      setTimeout(() => {
        try {
          if (!isHide) {
            interstitialAd
              .show()
              .then(() => {})
              .catch((err: any) => {
                console.log(err);
              })
              .finally(() => {
                this.setData!({
                  interstitialAd: null,
                });
              });
          }
        } catch (e) {
          console.log(e);
        }
      }, 15000);

      interstitialAd.onClose(() => {});

      interstitialAd.onError((err: any) => {
        console.log(err);
        // uploadAdError(err);
      });

      interstitialAd.onLoad(() => {
        console.log('on load event');
      });
    }
    // 检查新版本
    let um = wx.getUpdateManager();

    um.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        console.log('发现新版本');
      }
    });

    um.onUpdateReady(() => {
      wx.showModal({
        title: '更新',
        content: '新版本已经下载好了',
        confirmText: '立即更新',
        success: (res) => {
          res.confirm && um.applyUpdate();
        },
      });
    });
  },

  qiandao() {
    qiandao(videAd).then(() => {
      this.isSign();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    isHide = false;

    if (!interstitialAd) {
      return;
    }

    try {
      // @ts-ignore
      this.data.interstitialAd
        .show()
        .then(() => {})
        .catch(() => {})
        .finally(() => {
          this.setData!({
            interstitialAd: null,
          });
        });
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    isHide = true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  async onPullDownRefresh() {
    let list = JSON.parse(await getSummary('list', true));

    this.setData!({
      // @ts-ignore
      list,
    });

    this.isSign(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (): any {
    return {
      title: '开始 Docker 之旅~',
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
    };
  },
  onTabItemTap(item) {
    // tab 点击时执行
    console.log(item.index);
    console.log(item.pagePath);
    console.log(item.text);
  },
});
