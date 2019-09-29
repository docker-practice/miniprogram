function db_init(env: string = 'pro-02adcb') {
  console.log('init cloud db');

  wx.cloud.init({
    env,
  });

  return wx.cloud.database({
    env,
  });
}

export default class DB {
  static instance = db_init();

  private constructor() {}

  static getInstance() {
    // if(this.instance){
    //   this.instance = db_init();
    // }

    return this.instance;
  }
}
