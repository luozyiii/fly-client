'use strict';

// 定时任务：每隔3秒 打印本机状态信息
const Subscription = require('egg').Subscription;

class getInfo extends Subscription {
  static get schedule() {
    return {
      // interval: 3000, // 每3秒执行一次
      cron: '0 0 */3 * * *', // 每三小时准点执行一次
      type: 'worker',
    };
  }
  async subscribe() {
    const info = this.ctx.info;
    console.log(Date.now(), info);
  }
}

module.exports = getInfo;
