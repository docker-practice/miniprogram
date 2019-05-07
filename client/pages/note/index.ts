import { IMyApp } from '../../app';
const app = getApp<IMyApp>();
const fs = wx.getFileSystemManager();

import Token from '../../utils/Token';
import Issue from '../../utils/Issue';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    key: '',
    note: '',
    noteTitle: '',
    textareaValue: '',
    textareaTitleValue: '',
    theme: 'light',
    noticeBGColor: '#fff',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options: any) {
    const theme = app.globalData.theme!;
    const noticeBGColor = theme === 'dark' ? '#000000' : '#ffffff';

    this.setData!({
      key: options.key,
      theme,
      noticeBGColor,
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
      .finally(() => {});
  },
});
