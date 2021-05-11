/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620301657564_1710';

  // add your middleware config here
  config.middleware = [ 'httpLog' ];

  config.httpLog = {
    type: 'all',
  };

  // 插件auth 配置
  config.auth = {
    exclude: [ '/home', '/user', '/login', '/logout' ],
  };

  // 数据库 mysql
  config.mysql = {
    app: true,
    agent: false,
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: 'luo924361501',
      database: 'egg',
    },
  };

  // sequelize
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'luo924361501',
    database: 'egg',
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  };

  // 学习阶段暂时关闭csrf 防御
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
    // root: path.join(appInfo.baseDir, 'app/html'), // 自定义模板目录 root还支持数组 [path.join(appInfo.baseDir, 'app/html'), path.join(appInfo.baseDir, 'app/view')]
  };

  config.ejs = {
    delimiter: '%', // 全局修改分隔符
  };

  // 静态资源的配置 egg-static 将资源的存放目录更改为 app/assets
  // config.static = {
  //   prefix: '/assets/',
  //   dir: path.join(appInfo.baseDir, 'app/assets'),
  // };

  // session 配置
  // config.session = {
  //   key: 'BEST',
  //   httpOnly: false,
  //   maxAge: 1000 * 50,
  //   renew: true,
  // };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
