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
});
