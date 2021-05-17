### 注册接口

- 目录
/app/controller/user.js
/app/service/user.js
/router.js

- 使用md5加密
```javascript
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
```javascript
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

```javascript
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
>Redis 是一个基于内存的高性能key-value数据库。具有存储速度快、支持丰富的数据类型、过期后自动删除缓存等特点。

用户信息存放在session 上不利于多台服务部署，而且服务器stop，session会被销毁

```javascript
yarn add egg-redis

// /config/plugin.js
exports.redis = {
  enable: true,
  package: 'egg-redis',
};

// /config/config.default.js
config.redis = {
  client: {
    port: 6379,
    host: '127.0.0.1',
    password: 'abc123456',
    db: 0,
  },
};

// 设置redis 过期时间常量
const userConfig = {
  // myAppName: 'egg',
  salt: 'fly', // 密码后缀
  redisExpire: 60 * 60 * 24, // 过期时间常量
};

// 登录时设置
app.redis.set(username, 1, 'EX', app.config.redisExpire); // 1天过期

// 退出登录
app.redis.del(ctx.username);
```

### 优化
- 公共逻辑的提取
/controller/base.js
/service/base.js

- 中间件userExist.js
```javascript
// config.default.js 在这个位置配置 是全局生效，我们需要针对接口单独配置；故采用下面的配置
config.middleware = [ 'httpLog', 'userExist' ];

// router.js
const userExist = app.middleware.userExist();
router.post('/api/user/detail', userExist, controller.user.detail);
```

### 插件egg-notFound开发
>全局处理接口404

```javascript
// 目录
lib/plugin/egg-notFound

'use strict';
/**
 * 该插件用于处理接口404
*/
module.exports = options => {
  return async (ctx, next) => {
    // console.log(ctx.app.router);
    const flag = ctx.app.router.stack.filter(item => {
      return item.regexp.test(ctx.request.url);
    });
    if (flag.length) {
      await next();
    } else {
      ctx.body = {
        status: 404,
        errMsg: `接口${ctx.request.url}不存在`,
      };
    }
  };
};

// 在config/plugin.js 配置
exports.notFound = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-notFound'),
};

// app.js 上引用
app.config.coreMiddleware.push('notFound');

```

### 获取城市列表数据，基于Sequelize多表联查编写热门民宿接口
- 目录
app/controller/commons.js
>利用httpclient 转发第三方接口

### 热门民宿接口
>基本流程：编写路由(指定控制器) => 控制器(调用service) => service(操作数据库) 

```javascript
/api/house/hot

// model/house
// 一个房子对应多个图片 hasMany; 表关联
House.associate = () => {
  app.model.House.hasMany(app.model.Imgs, { foreignKey: 'houseId' });
};

// serive/house
include: [
  {
    model: app.model.Imgs,
    limit: 1,
    attributes: [ 'url' ],
  },
], // 与Imgs图片表关联
```

### 搜索接口
```javascript
// 分页查询
offset: (pageNum - 1) * pageSize,

// 条件查询
where

// 模糊查询
[like]: `%${houseSubmitName}%`,
```

### 民宿详情接口
- 更新浏览次数
```javascript
await ctx.model.House.update({
  showCount: result.showCount + 1,
}, { where: { id } });
```

- model 下控制返回时间是时间戳
```javascript
//  model/house.js
startTime: {
  type: DATE,
  get() {
    return new Date(this.getDataValue('startTime')).getTime();
  },
},
```

### 评论列表和添加评论接口
```javascript
// 添加路由
router.post('/api/comment/add', controller.comment.add);
router.post('/api/comment/lists', controller.comment.lists);

// model/comment.js
// 特别注意 多对一
Comment.associate = () => {
  app.model.Comment.belongsTo(app.model.User, { foreignKey: 'userId' });
};

// service/comment.js
 const { pageNum, pageSize, userId, houseId } = params;
  const where = {
    userId,
    houseId,
  };
  const result = await ctx.model.Comment.findAll({
    limit: pageSize,
    offset: (pageNum - 1) * pageSize,
    where,
    include: [
      {
        model: app.model.User,
        attributes: [ 'avatar', 'username' ],
      },
    ], // 多对一 的配置
  });
  return result;
```

### 编写预定和取消预定民宿接口，与前端联调

### 订单接口

### 模拟支付
 