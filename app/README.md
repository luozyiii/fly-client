### 注册接口

- 目录
/app/controller/user.js
/app/service/user.js
/router.js

- 使用md5加密
```
yarn add md5

// 增加配置
// config.default.js
const userConfig = {
  // myAppName: 'egg',
  salt: 'fly',
};

// /app/controller/user.js 使用
app.config.salt

```

- 封装一些常用方法
```
// extend/hleper.js
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

// 使用

```

### 登录接口
与注册类似
- 目录
/app/controller/user.js
/app/service/user.js
/router.js

### 使用JWT优化注册登录
- 什么是JWT?
JWT全称JSON Web Tokens，是一种规范化的token。它里面包含用户信息，具有验证用户身份、防止CSRF攻击等优点。

- JWT的使用
Client 请求登录接口 => 使用JWT进行签名，返回token => 请求接口携带token(可自定义header或者放在body) => 验证token，返回接口

```
yarn add egg-jwt

// config/plugin.js
exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};

// congif/config.default.js
config.jwt = {
  secret: 'fly', // 密钥
};

// 重启服务
```

### Redis 
Redis 是一个基于内存的高性能key-value数据库。具有存储速度快、支持丰富的数据类型、过期后自动删除缓存等特点。

