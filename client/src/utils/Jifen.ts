import UserInfo from './UserInfo';
import DB from '../Framework/src/Support/DB';

const db = DB.getInstance();

export default class Jifen {
  async get() {
    return await UserInfo.getOpenId().then(async _openid => {
      return await db
        .collection('sign')
        .where({
          _openid,
        })
        .get()
        .then(res => {
          // console.log(res);
          return res.data[0].jifen || 0;
        });
    });
  }
}
