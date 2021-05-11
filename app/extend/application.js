'use strict';

const path = require('path');

module.exports = {
  // 方法拓展
  package(key) {
    const pack = getPack();
    return key ? pack[key] : pack;
  },

  // 属性拓展
  get allPackage() {
    return getPack();
  },
};

function getPack() {
  const filePath = path.join(process.cwd(), 'package.json');
  const pack = require(filePath);
  return pack;
}
