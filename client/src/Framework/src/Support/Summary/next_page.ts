import getSummary from '../../../../utils/getSummary';

class getObj {
  static obj: any;

  static async getInstance() {
    if (!this.obj) {
      console.log('fetch summary index');
      this.obj = JSON.parse(await getSummary('index', false));
    }

    return this.obj;
  }
}

async function getIndex(key: any) {
  let result: any;
  let obj = await getObj.getInstance();

  obj.forEach((item: any, i: any) => {
    if (item['path'] === key) {
      result = i;
    }
  });

  return result;
}

function parse(result: any) {
  let title: string = result['title'];
  let key: string = result['path'];

  return [title, key];
}

async function next(key: any) {
  let index = await getIndex(key);
  let obj = await getObj.getInstance();

  let result = obj[index + 1];

  if (result) {
    return parse(result);
  }

  return undefined;
}

async function before(key: any) {
  let index = await getIndex(key);
  let obj = await getObj.getInstance();

  let result = obj[index - 1];
  if (result) {
    return parse(result);
  }

  return undefined;
}

export { before, next };

export default next;
