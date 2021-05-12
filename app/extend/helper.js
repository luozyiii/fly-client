'use strict';
const dayjs = require('dayjs');

module.exports = {
  base64Encode(str = '') {
    return new Buffer(str).toString('base64');
  },
  // 当前时间
  time() {
    return dayjs().format('YYYY-MM-DD HH:hh:ss');
  },
  // 转时间戳
  timestamp(data) {
    return new Date(data).getTime();
  },
  /**
   *
   * @param {*} source 数据源
   * @param {*} arr 剔除的属性
   * @return
   */
  unPick(source, arr) {
    if (Array.isArray(arr)) {
      const obj = {};
      for (const i in source) {
        if (!arr.includes(i)) {
          obj[i] = source[i];
        }
      }
      return obj;
    }
  },
};
