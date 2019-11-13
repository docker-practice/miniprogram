import Cache from '../Framework/src/Support/Cache';
import DB from '../Framework/src/Support/DB';

let cache = new Cache();

let db = DB.getInstance();

async function forceUpdate(type: any = 'list') {
  let result = await db
    .collection('system')
    .doc('summary')
    .get()
    .then();
  // console.log(result.data);
  let { index, list } = result.data;

  cache.set('system/summary/list', list);
  cache.set('system/summary/index', index);

  if (type === 'list') {
    return list;
  }

  return index;
}

export default async function(type = 'list', force = false) {
  if (force) {
    return await forceUpdate(type);
  }

  let result;

  if ((result = await cache.get('system/summary/' + type))) {
    console.log('summary cached');
    return result;
  }

  return await forceUpdate(type);
}
