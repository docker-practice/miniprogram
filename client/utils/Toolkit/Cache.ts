export default class Cache {
  checkTTL(key: string, res: wx.GetStorageSuccessCallbackResult) {
    if (res.data.ttl === undefined) {
      wx.removeStorage({
        key,
      });

      return false;
    }

    let ttl = res.data.ttl || 0;
    if (ttl === 0 || ttl > new Date().getTime()) {
      return true;
    }

    wx.removeStorage({
      key,
    });

    return false;
  }

  async get(key: string): Promise<any> {
    return await new Promise(resolve => {
      wx.getStorage({
        key,
        success: res => {
          let data = res.data.value;

          if (this.checkTTL(key, res)) {
            return resolve(data);
          }

          return resolve(undefined);
        },
        fail: () => {
          // 不存在进入 fail 回调
          return resolve(undefined);
        },
      });
    });
  }

  async exists(key: string) {
    return await new Promise(resolve => {
      wx.getStorage({
        key,
        success: res => {
          if (this.checkTTL(key, res)) {
            return resolve(true);
          }

          resolve(false);
        },
        fail: () => {
          resolve(false);
        },
      });
    });
  }

  /**
   *
   *
   * @param ttl    number  s
   * @param today  today   only on today
   */
  async set(
    key: string,
    value: string = '',
    ttl: number = 0,
    today: boolean = false,
  ) {
    ttl = ttl ? new Date().getTime() + ttl * 1000 : ttl;

    if (today) {
      let dateInstance = new Date();
      let year = dateInstance.getFullYear();
      let month = dateInstance.getMonth();
      let date = dateInstance.getDate();

      let time =
        Date.UTC(year, month, date) +
        dateInstance.getTimezoneOffset() * 60 * 1000;
      ttl = time + 24 * 3600 * 1000;
    }

    const data = {
      value,
      ttl,
    };

    return await new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data,
        success: () => {
          resolve(true);
        },
        fail: () => {
          reject(false);
        },
      });
    });
  }

  async flush() {
    return await new Promise((resolve, reject) => {
      wx.clearStorage({
        success: () => {
          resolve();
        },
        fail: () => {
          reject();
        },
      });
    });
  }

  async del(key: string) {
    return await new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: () => {
          resolve();
        },
        fail: () => {
          reject();
        },
      });
    });
  }
}
