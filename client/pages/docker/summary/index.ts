//import { IMyApp } from '../../../app';
//const app = getApp<IMyApp>();

import list from './summary';
import daShang from '../../../utils/DaShang';
import openGithub from '../../../utils/OpenGithub';
import qiandao from '../../../utils/Qiandao';
import { isSign } from '../../../utils/Qiandao';
import Ad from '../../../utils/Ad';

const ad = new Ad();

// test
import test from '../../../utils/Toolkit/test/index';
test();

// worker
let worker = wx.createWorker('workers/test/index.js');

worker.postMessage({
  msg: 'main message',
});

worker.onMessage(res => {
  console.log(res);
});

worker.terminate();

let videAd: wx.RewardedVideoAd;
let interstitialAd: any;

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
    showAd: true,
  },

  kindToggle: function(e: any) {
    let id = e.currentTarget.id;
    let list: any = this.data.list;

    if (id === 'dashang') {
      this.dashang();
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

    if (id === 'alipay') {
      ad.alipay();
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
        title: '已签到',
        content: '明天记得来学习哟',
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
      ad.bus();
      return;
    }

    if (id === 'yuebao') {
      ad.yuebao();
      return;
    }

    // wx.showModal({
    //   title: '请发电子邮件洽谈',
    //   content: 'docker@khs1994.com',
    //   showCancel: false,
    // });
    this.buyBook();
  },

  isSign(local: boolean = false) {
    isSign('', local).then(res => {
      res &&
        (list[0] = {
          id: 'sign',
          name: '已签到',
        });

      this.setData!({
        // @ts-ignore
        list,
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData!({
      // @ts-ignore
      list,
    });

    this.isSign(true);

    if (wx.getSystemInfoSync().platform === 'devtools') {
      return;
    }

    // 激励广告
    if (wx.createRewardedVideoAd) {
      videAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-a929f1a7fb4e4e96',
      });

      videAd.onError(res => {
        wx.showModal({
          title: '提示',
          content: JSON.stringify(res),
          showCancel: false,
        });
      });
    }

    // 插屏广告
    // @ts-ignore
    if (wx.createInterstitialAd) {
      // @ts-ignore
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-6ef44789d84b9392',
      });

      setTimeout(() => {
        interstitialAd.show().then(
          () => {},
          (err: any) => {
            console.log(err);
          },
        );
      }, 15000);

      interstitialAd.onClose(() => {});

      interstitialAd.onError((res: any) => {
        console.log(res);
      });

      interstitialAd.onLoad(() => {
        console.log('on load event');
      });
    }
    // 检查新版本
    let um = wx.getUpdateManager();

    um.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        console.log('发现新版本');
      }
    });

    um.onUpdateReady(() => {
      wx.showModal({
        title: '更新',
        content: '新版本已经下载好了',
        confirmText: '立即更新',
        success: res => {
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
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(): any {
    return {
      title: '开始 Docker 之旅~',
      imageUrl:
        'https://gitee.com/docker_practice/docker_practice/raw/master/_images/cover.jpg',
      fail() {
        wx.showToast({
          title: '转发失败',
          icon: 'success',
        });
      },
    };
  },
});
