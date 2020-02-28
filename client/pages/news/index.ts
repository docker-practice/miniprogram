import DB from '../../src/Framework/src/Support/DB';

const db = DB.getInstance();

let n = 1;

let end = false;

function onEnd() {
  wx.showToast({
    title: '到底了',
  });
}

// 这里的变量，在 page 中赋值之后，关闭页面再重新进入，值还会保留。
let a:any;

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
    console.log(a);
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
  onReady: function() {
    console.log('on ready');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('on show');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('on hide');
    end = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('on unload');
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
    a = 1; 
    console.log(res);
    const key = res.currentTarget.dataset.key;
    wx.navigateTo({
      url: '../mdContent/index?key=' + key,
    });
  },
});
