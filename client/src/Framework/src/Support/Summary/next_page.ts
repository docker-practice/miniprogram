import summary from './summary';

const obj = summary;

function getIndex(key: any) {
  let result: any;

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

function next(key: any): any {
  let index = getIndex(key);
  let result = obj[index + 1];

  if (result) {
    return parse(result);
  }

  return undefined;
}

function before(key: any): any {
  let index = getIndex(key);
  let result = obj[index - 1];
  if (result) {
    return parse(result);
  }

  return undefined;
}

export { before, next };

export default next;
