// import { IMyApp } from '../../../app';
// const app = getApp<IMyApp>();

import list from './summary';
import daShang from '../../../utils/DaShang';
import openGithub from '../../../utils/OpenGithub';
import bus from '../../../utils/bus';
import alipay from '../../../utils/Alipay';
let videAd: any = null;

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

    if (id == 'bus' || id === 'beta') {
      this.bus();
      return;
    }

    if (id === 'alipay') {
      alipay();
      return;
    }

    if (id === 'oldmenu') {
      wx.navigateTo({
        url: '/pages/docker/index/index',
      });
      return;
    }

    if (id === 'qiandao') {
      this.qiandao();
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

  bus() {
    if (this.data.showAd) {
      bus();
      return;
    }

    wx.showModal({
      title: '请发电子邮件洽谈',
      content: 'docker@khs1994.com',
      showCancel: false,
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

    // 激励广告
    //@ts-ignore
    if (wx.createRewardedVideoAd) {
      //@ts-ignore
      videAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-a929f1a7fb4e4e96',
      });
    }

    //@ts-ignore
    videAd.onClose(status => {
      console.log(status);

      if (status.isEnded) {
        wx.showModal({
          title: '签到成功',
          content: '积分 +2',
          showCancel: false,
        });
      } else {
        wx.showModal({
          title: '签到成功',
          content: '积分 +1',
          showCancel: false,
        });
      }
    });

    //@ts-ignore
    videAd.onError(res => {
      wx.showModal({
        title: '出现错误',
        content: JSON.stringify(res),
      });
    });
  },

  showVideoAd() {
    //@ts-ignore
    videAd.show().catch(err => {
      wx.showModal({
        title: '出现错误',
        content: JSON.stringify(err),
      });
      //@ts-ignore
      videAd.load().then(() => {
        //@ts-ignore
        videAd.show();
      });
    });
  },

  qiandao() {
    wx.showModal({
      title: '获得额外积分',
      content: '观看完整广告视频，额外获得 1 积分',
      confirmText: '观看视频',
      cancelText: '立即签到',
      success: res => {
        if (res.confirm) {
          this.showVideoAd();
        } else {
          wx.showModal({
            title: '签到成功',
            content: '积分 +1',
            showCancel: false,
          });
        }
      },
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
