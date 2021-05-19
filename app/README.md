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

### 优化用户信息获取方式，对egg框架进行扩展
>token信息包括用户id和用户名称

## 项目安全

### XSS 常见攻击方式与解决思路
- XSS跨站脚本攻击：在web页面注入脚本，使用JavaScript窃取用户信息
- SQL注入攻击：将用户传入的数据作为参数，使用字符串拼接的方式查到SQL查询中
- CSRF跨域请求伪造：伪造用户请求向网站发起恶意请求
- 海量接口请求：通过短时间内向服务器发起海量的请求，耗尽服务器资源，使服务器崩溃

#### XSS 攻击手段
- DOM-based型攻击：利用dom本身的缺陷，进行攻击。
```javascript
<img src="1" onerror="javascript:alert('xss')">
```
- 存储型：表单提交的数据存在恶意代码，被保存到目标网站的服务器中
- 反射型：恶意代码没有保存在目标网站，通过引诱用户点击一个链接到目标网站的恶意链接来实施攻击

### XSS防御手段
- 过滤：对用户的输入进行过滤，移除用户输入的Style节点、Script节点、IFrame等节点
- 编码：HTML Entity编码
- cookie：将重要的cookie设置成http only这样就不能通过js获取cookie

### SQL 注入防御手段
- 验证输入类型：比如根据id查询数据，那么变量必须是整型
- 转义特殊字段：比如引号、分号和横线等，在执行CURD前都需要进行转义

### CSRF攻击手段
浏览器 => Web A(安全) => 浏览器 => Web B(危险) => Web A

1、浏览并登陆网站A；
2、通过验证，生成cookie
3、用户访问网站B
4、网站B携带cookie访问网站A

### CSRF防御手段
- 使用token：服务器发送给客户端一个token，客户端请求接口带上该token，服务器验证token是否有效，有效就允许访问，否则拒绝访问。
- Referer验证：Referer指的是页面请求来源，意思是：只接受本站的请求，服务器才做响应；如果不是，就拦截
```javascript
// egg-allowHosts

```

### 接口防御手段
- 服务限流：服务器在一定时间段内只接受一定量的请求，超出限制则拒绝执行
```javascript
// egg-interfaceLimit
接口限流思路：3秒内最多允许3个接口请求
1、设置计数器，每次请求加1；保存起始时间
2、超过3秒，计数器大于3，则提示请求频繁；计数器清零，起始时间修改为当前时间
3、超过3秒，计数器小于3，计数器清零，起始时间修改为当前时间
```

- 接口缓存：将常用的接口进行缓存，减少对数据库的查询
```javascript
// egg-interfaceCache
接口思路：
1，接口地址作为redis中的key
2，查询redis，有缓存，返回返回接口
3，没有缓存，将接口返回结果保存到redis中
```

### 项目部署
- mysql
```javascript
// 查询镜像
docker search mysql

// 拉取最新镜像
docker pull mysql:latest

// 查看本地镜像
docker images

// 运行容器
docker run -itd --name 容器名 -p 3307:3306 -e MYSQL_ROOT_PASSWORD=abc123456 镜像ID

// 查看运行中容器； -a 全部
docker ps

// 进入容器内部
docker exec -it  容器ID sh

// 登录数据库;接着输入密码
mysql -uroot -p

// 查看数据库
show databases;

// 使用某个数据库
use 数据库名称;

// 查看表
show tables;

// 退出
exit
```

- redis
```javascript
// 拉取镜像
docker pull redis:latest

// 删除镜像
docker rmi 镜像ID

// 运行
docker run -d -p 6379:6379 --name redis bc8d70f9ef6c(镜像ID) --requirepass abc123456

// 进入容器
docker exec -it ac973b986754(容器ID) sh
redis-cli -a abc123456

// 操作
set a 10
get a
del a
```

- 部署到node环境
```javascript
// 拉取node镜像
docker pull node:latest


// 编写Dockerfile
# 使用node镜像
FROM docker.io/node
# 在容器中新建目录文件夹 egg
RUN mkdir -p /egg
# 将 /egg 设置为默认工作目录
WORKDIR /egg
# 将 package.json 复制默认工作目录
COPY package.json /egg/package.json
# 安装依赖
RUN yarn config set register https://registry.npm.taobao.org
RUN yarn --production
# 再copy代码至容器
COPY ./ /egg
#7001端口
EXPOSE 7001
#等容器启动之后执行脚本
CMD yarn prod

// 拷贝代码到远程服务器
scp -rp egg.zip root@112.74.201.142:/home/fly

// 安装解压
yum install -y unzip zip

// 解压到server目录
unzip -u -d server egg.zip

// 构建一个镜像
docker build -t egg-fly:v1.0 ./server

// 运行容器
docker run -d -p 7001:7001 --name fly-client fd0dca8fa8b3(镜像ID)

```

- ngnix
```javascript
// 将nginx代码拷贝到服务器
scp -rp nginx root@112.74.201.142:/home/fly

// nginx 服务部署,映射本地目录到nginx容器
docker run -d -p 80:80 --name nginx-fly \
  -v /home/fly/nginx/logs:/var/log/nginx \
  -v /home/fly/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
  -v /home/fly/nginx/conf.d:/etc/nginx/conf.d \
  -v /home/fly/nginx/html:/usr/share/nginx/html \
  f0b8a9a54136


docker run -d -p 8084:80 --name nginx-fly-4 \
  -v /home/fly/nginx/html:/usr/share/nginx/html \
  -v /home/fly/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
  -v /home/fly/nginx/logs:/var/log/nginx \
  f0b8a9a54136

```