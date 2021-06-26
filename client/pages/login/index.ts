// pages/login/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isloading: false,
    // username: '',
    // password: '',
    color: 'black', // white
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.getSystemInfo({
      success:(res)=>{
        this.setData({
          color: res.theme == 'dark' ? 'white' : 'black'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  async login(res: any) {
    // console.log(res);
    const username = res.detail.value.username;
    let password = res.detail.value.password;

    if(!username){
      wx.showModal({
         content: "请输入用户名",
         showCancel: false,
      });

      return;
    }

    this.setData!({
      isloading: password != "",
      isScanQrLoading: password == "",
    });

    if (!password) {
      password = await wx.scanCode({}).then((res) => {
        const result = res.result;
        console.log("==> Get token from qr: " + result);

        return result;
      });
    }

    // const username = this.data.username;
    // const password = this.data.password;

    console.log(username, password);

    const fs = wx.getFileSystemManager();

    fs.writeFileSync(
      `${wx.env.USER_DATA_PATH}/token`,
      `${username}:${password}`,
      "utf-8",
    );
    const token = fs.readFileSync(`${wx.env.USER_DATA_PATH}/token`, "base64");

    wx.request({
      url: "https://ci.khs1994.com/proxy_github_api/user",
      header: {
        Authorization: "Basic " + token,
      },
      success: (res: any) => {
        if (res.statusCode !== 200) {
          this.loginError();

          return;
        }

        wx.showToast({
          title: "登录成功",
        });

        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          });
        }, 1500);
      },
      fail: () => {
        this.loginError();
      },
    });
  },

  loginError() {
    const fs = wx.getFileSystemManager();

    fs.unlink({
      filePath: `${wx.env.USER_DATA_PATH}/token`,
    });

    this.setData!({
      isloading: false,
      isScanQrLoading: false,
    });

    wx.showModal({
      title: "登录失败",
      content: "请检查用户名及密码是否正确",
      showCancel: false,
    });
  },
});
