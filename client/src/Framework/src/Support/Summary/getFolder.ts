// 从 key 获取文件夹

export default function getFolder(key: string) {
  let key_array = key.split('/');
  let key_array_length = key_array.length;

  if (key_array_length === 1) {
    return '/';
  }

  key_array.length = key_array.length - 1;

  return key_array.join('/') + '/';
}
