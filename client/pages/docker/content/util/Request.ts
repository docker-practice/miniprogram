// 请求 markdown 数据

export default class Request {
  create(key: string, baseUrl: string, folder: string) {
    // let url = `https://ci.khs1994.com/proxy_github_raw/yeasy/docker_practice/master/${key}`;
    // const base_url = 'https://gitee.com/docker_practice/docker_practice/raw/master';

    let url = `${baseUrl}/${key}`;

    if (key === 'README.md' || key === 'miniprogram.md') {
      // url = 'https://ci.khs1994.com/proxy_github_raw/khs1994-docker/docker_practice/master/README.md';
      url = `https://gitee.com/khs1994-docker/docker_practice/raw/master/${key}`;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        success: (res: any) => {
          let MDData = res.data;

          async function requestImg(folder: string, baseUrl: string) {
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
                let new_item = `![](${baseUrl}/${folder}${img})`;

                // console.log(item, new_item);
                MDData = MDData.replace(item, new_item);
              }
            }

            return MDData;
          }

          requestImg(folder, baseUrl)
            .then((MDData: any) => {
              resolve(MDData);
            })
            .catch(() => {
              reject(MDData);
            });
        },

        fail() {
          wx.showToast({
            title: '网络连接失败',
            icon: 'loading',
          });
        },
      });
    });
  }
}
