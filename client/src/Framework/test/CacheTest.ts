import Cache from '../src/Support/Cache';
import assert from './assert';

let cache = new Cache();

cache.set('test/a', '1', 1).then(() => {
  setTimeout(() => {
    cache.get('test/a').then((res) => {
      assert(() => res === undefined);
    });
  }, 2000);
});

cache.set('test/b', '1', 1, true).then(() => {
  setTimeout(() => {
    cache.get('test/b').then((res) => {
      assert(() => res === '1');
    });
  }, 2000);
});

cache.get('test/no_exists').then((res) => {
  assert(() => {
    return res === undefined;
  });
});

cache.exists('test/no_exists').then((res) => {
  assert(() => {
    return res === false;
  });
});

cache.set('test/exists_a', undefined).then(() => {
  cache.exists('test/exists_a').then((res) => {
    assert(() => {
      return res === true;
    });
  });
});

cache.set('test/c', '1', 1).then(() => {
  setTimeout(() => {
    cache.exists('test/c').then((res) => {
      assert(() => res === false);
    });
  }, 2000);
});

export = 1;
