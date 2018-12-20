Page({
  data: {
    switch: true,
    rate_index: 0,
    storageSize: '0 MB',
  },
  onLoad() {
    wx.getStorage({
      key: 'rate',
      success: (e: any) => {
        this.setData!({
          rate_index: e.data,
        });
      },
    });

    wx.getStorageInfo({
      success: (res: any) => {
        this.setData!({
          storageSize: (res.currentSize / 1024).toFixed(2) + ' MB',
        });
      },
    });
  },
  onChange(e: any) {
    console.log(e);
    this.setData!({
      switch: e.detail.value,
    });
  },
  rate(e: any) {
    const index = e.detail.index;

    this.setData!({
      rate_index: index,
    });

    wx.setStorage({
      key: 'rate',
      data: index,
    });
  },
  cleanup() {
    wx.clearStorage({
      success: () => {
        this.setData!({
          storageSize: '0.00 MB',
        });
      },
    });
  },
});
