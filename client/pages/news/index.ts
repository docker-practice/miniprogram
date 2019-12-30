import DB from '../../src/Framework/src/Support/DB';

const db = DB.getInstance();

let n = 1;

let end = false;

function onEnd() {
  wx.showToast({
    title: '到底了',
  });
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    news: [
      //   {
      //     "title" : "标题标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1",
      //     "time" : "2019/12/01"
      //   },
      //   {
      //     "title" : "标题标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1标题1",
      //     "time" : "2019/11/04"
      //   },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    db.collection('news')
      .orderBy('_id', 'desc')
      .limit(10)
      .get()
      .then(res => {
        console.log(res);
        this.setData!({
          // @ts-ignore
          news: res.data,
        });
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
  onHide: function() {
    console.log('hide');
    end = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('unload');
    end = false;
    n = 1;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(end);
    if (end) {
      onEnd();

      return;
    }

    const news = this.data.news;
    db.collection('news')
      .orderBy('_id', 'desc')
      .skip(10 * n)
      .limit(10)
      .get()
      .then(res => {
        console.log(res);
        console.log(res.data.length);
        if (res.data.length === 0) {
          onEnd();

          end = true;

          return;
        }
        this.setData!({
          // @ts-ignore
          news: [...news, ...res.data],
        });

        n += 1;
      });
  },

  click(res: any) {
    console.log(res);
    const key = res.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../mdContent/index?key=' + key,
    });
  },
});
