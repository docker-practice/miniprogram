import * as MarkdownHandler from 'towxml';

const towxml = new MarkdownHandler();

function randomInsert(insertArr: Array<any>, arr: Array<any>) {
  // console.log(arr.length);
  if (arr.length > 30) {
    insertArr = [...insertArr, { node: 'ad', adId: 'adunit-1246f0a5e441ea4c' }];
  }
  insertArr.forEach((value: any) =>
    arr.splice(Math.random() * arr.length, 0, value),
  );
  return arr;
}

function parsePath(href: string) {
  let arr: Array<string | null> = href.split('/');

  while (true) {
    let index = arr.indexOf('..');
    if (index === -1) {
      break;
    }

    arr[index] = null;
    arr[index - 1] = null;
    // remove null
    arr = arr.filter(d => d);
  }

  return arr.join('/');
}

Component({
  properties: {
    // markdown 原始数据
    markdown: {
      type: String,
      value: '',
    },
    theme: {
      type: String,
      value: 'light',
    },
    ad: {
      type: String,
      value: '',
    },
    fontType: {
      type: String,
      value: '',
    },
    folder: {
      type: String,
      value: '',
    },
  },
  data: {
    MDdata: '',
  },
  lifetimes: {
    attached(): void {},
  },
  observers: {
    markdown() {
      // @ts-ignore
      if (this.properties.markdown === '') {
        return;
      }
      // @ts-ignore
      let MDdata = towxml.toJson(this.properties.markdown, 'markdown');
      // @ts-ignore
      MDdata.theme = this.properties.theme;
      MDdata.child = randomInsert(
        [{ node: 'ad', adId: 'adunit-3ea71b7cfce6c721' }],
        MDdata.child,
      );
      // @ts-ignore
      MDdata.fontType = this.properties.fontType;
      // @ts-ignore
      this.setData({
        MDdata,
      });
    },
  },
  // @ts-ignore
  methods: {
    // towxml 事件
    __bind_touchend() {
      // console.log('触摸结束' + res);
      // let endX= res.changedTouches[0].pageX;
      // let endY = res.changedTouches[0].pageY;
      //
      // let diff_y = endY - <any>this.data.startY;
      // let diff_x = endX - <any>this.data.startX;
      //
      // console.log(diff_x,diff_y);
      //
      // if(Math.abs(diff_y) > 10 ){
      //   return;
      // }
      //
      // diff_x > 40 && this.before();
      // diff_x < -40 && this.next();
    },

    __bind_touchstart() {
      // console.log('触摸开始' + res);
      // let startX=res.touches[0].pageX;
      // let startY = res.changedTouches[0].pageY;
      //
      // this.setData!({
      //   startX,
      //   startY,
      // });
    },

    __bind_touchmove() {
      // console.log('触摸中' + res);
    },

    __bind_tap(res: any) {
      console.log(res);
      let href = res.currentTarget.dataset._el.attr.href || '';

      if (
        href.match(/^http:\/\//g) ||
        href.match(/^https:\/\//g) ||
        href === '' ||
        !href.match(/.md$/g)
      ) {
        return;
      }

      // @ts-ignore
      const folder = this.properties.folder;

      href = folder === '/' ? href : folder + href;

      if (href.match(/../g)) {
        console.log(href);
        href = parsePath(href);
      }

      wx.navigateTo({
        url: 'index?key=' + href,
      });
    },

    __bind_touchcancel() {},
  },
});
