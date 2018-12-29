// github token

const fs = wx.getFileSystemManager();

export default class Token {
  check() {
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
  }
}
