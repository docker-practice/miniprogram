// github issue

export default class Issue {
  create(key: string, note: string, noteTitle: string, token: string) {
    let repo = 'yeasy/docker_practice';

    if (key === 'miniprogram.md') {
      repo = 'docker-practice/miniprogram';
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url:
          'https://ci.khs1994.com/proxy_github_api/repos/' + repo + '/issues',
        method: 'POST',
        data: {
          title: noteTitle,
          body:
            note +
            '\n' +
            `

## This issue from docker_practice miniprogram

> [${key}](https://github.com/yeasy/docker_practice/blob/master/${key})
`,
        },
        header: {
          Authorization: 'Basic ' + token,
        },
        success: (res: any) => {
          if (res.statusCode !== 201) {
            this.pushNoteError(res);

            return;
          }

          wx.showModal({
            title: '提交成功',
            content: '请登录 GitHub 查看最新回复',
            showCancel: false,
            success: () => {
              resolve('success');
            },
          });
        },
        fail: (e: any) => {
          this.pushNoteError(e);
          reject('fail');
        },
      });
    });
  }

  // 提交 note 出现错误
  pushNoteError(e: any) {
    wx.showModal({
      title: '提交失败',
      content: JSON.stringify(e),
      showCancel: false,
    });
  }
}
