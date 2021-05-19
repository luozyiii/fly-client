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
    exclude: [ '/api/user/login', '/api/user/register' ],
  };

  // 配置允许请求的host
  config.allowHosts = [ 'localhost:8080', '127.0.0.1:8080', '10.0.9.4:8000' ];

  // 接口限流配置
  config.interfaceLimit = {
    maxCount: 3, // 最多请求个数
    time: 3 * 1000, // 间隔时间
  };

  // 接口缓存配置
  config.interfaceCache = {
    expire: 10,
    include: [ '/api/user/detail' ],
  };

  // 数据库 mysql
  // config.mysql = {
  //   app: true,
  //   agent: false,
  //   client: {
  //     host: '127.0.0.1',
  //     port: '3306',
  //     user: 'root',
  //     password: 'luo924361501',
  //     database: 'egg',
  //   },
  // };

  // sequelize
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'luo924361501',
    database: 'egg_fly',
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

  config.jwt = {
    secret: 'fly', // 密钥
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: 'abc123456',
      db: 0,
    },
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
    salt: 'fly', // 密码后缀
    redisExpire: 60 * 60 * 24, // 过期时间常量
  };

  return {
    ...config,
    ...userConfig,
  };
};
