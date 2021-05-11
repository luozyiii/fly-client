# Egg.js

## Egg.js 基础--路由控制器服务模板引擎

### 控制器（controller）的使用和单元测试
- 目录： /app/controller/user
路由目录： /app/router.js
简单的说 Controller 负责解析用户的输入，处理后返回相应的结果，例如
(1) 在 RESTful 接口中，Controller 接受用户的参数，从数据库中查找内容返回给用户或者将用户的请求更新到数据库中。
(2) 在 HTML 页面请求中，Controller 根据用户访问不同的 URL，渲染不同的模板得到 HTML 返回给用户。
(3) 在代理服务器中，Controller 将用户的请求转发到其他服务器上，并将其他服务器的处理结果返回给用户。

- 单元测试
目录： /test/app/user.test.js
```
yarn test // 执行
```

- 实用vs code 插件 project-tpl
快速生成模版 
eg: 页面上输入controller, 选择该模版

### Egg.js 路由中get的请求方式处理和参数获取
分两种（/app/controller/user.js 下的detail 和 detail2）
单元测试 在 ／test/app/controller/user.test.js
```
// 一、http://127.0.0.1:7001/user/detail?id=123&name=leilie

ctx.query

// 二、http://127.0.0.1:7001/user/detail2/100
ctx.params
```

### Egg.js 路由中 post.put.delete等请求的处理及参数校验
- 暂时关闭csrf防御
```
// 学习阶段暂时关闭csrf 防御
  config.security = {
    csrf: {
      enable: false,
    },
  };
```

- post、put获取参数
```
ctx.request.body
```

- 利用postman 发起post请求

- egg-validate

```
// 安装
yarn add egg-validate

// 在/config/plugin.js增加配置
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
```
- 单元测试
单元测试 在 ／test/app/controller/user.test.js 
add、edit、del


### Egg.js 中 Service 服务和单元测试
service 在egg 上挂载到ctx(上下文)

- 目录
/app/service/user.js 在controller detaill 中应用

- 单元测试
/test/app/service/user.test.js
```
const ctx = app.mockContext();
const user = await ctx.service.user.detail(10);
assert(user);
assert(user.id === 10);
```

### Egg.js 中使用Ejs模板引擎
- 后端渲染由来已久，渲染性能得到业界的认可
- 利于SEO优化，对纯展示类网站体验较好
- 对前后端分离开发模式的补充（单点登录的登录页面）

```
yarn add egg-view-ejs // 安装

// 在config plugin.js 配置
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};


// 在 config.default.js 配置
config.view = {
  mapping: {
    '.html': 'ejs',
  },
};

config.ejs = {

};

// 应用 
/app/controller/user  index
/view/user.html

// 模板引擎的分隔符全局和局部配置
// 全局 config.default.js
config.ejs = {
  delimiter: '$', // 全局修改分隔符
};

// 局部配置
await ctx.render('user.html', {
  id: 100,
  name: 'admin',
  list: [ 'html', 'js', 'css' ],
}, {
  delimiter: '$',
});


// 模板引擎目录的配置
config.view = {
  mapping: {
    '.html': 'ejs',
  },
  root: path.join(appInfo.baseDir, 'app/html'), // 自定义模板目录 root还支持数组 [path.join(appInfo.baseDir, 'app/html'), path.join(appInfo.baseDir, 'app/view')]
};

```

### Ejs 模版引擎中静态资源的使用和配置
- 目录
/public/*
```
http://127.0.0.1:7001/public/css/user.css
```

- 内置了egg-static 插件 处理静态资源
egg-static 是基于koajs static-cache 的二次封装

- 自定义配置
```
// 静态资源的配置 egg-static 将资源的存放目录更改为 app/assets
config.static = {
  prefix: '/assets/',
  dir: path.join(appInfo.baseDir, 'app/assets'),
};
```

- 页面上引用
```
// css
<link rel="stylesheet" type="text/css" href="public/css/user.css" />
// img
<img src="public/img/2.jpeg" />
// js
<script src="public/js/user.js"></script>
```

### Egg.js 中 Cookie 的配置和使用以及如何设置中文cookie 
- 示例：登录/注销
```
http://127.0.0.1:7001/user

ctx.cookies.set('user', JSON.stringify(body), {
  maxAge: 1000 * 60 * 10,
  httpOnly: false,
});

ctx.cookies.set('user', null);

```

- egg 框架中无法直接设置中文cookie
（将中文转化成字符串）
```
// 方案一：加密/解密
ctx.cookies.set('zh', '测试', {
  encrypt: true,
});
const zh = ctx.cookies.get('zh', {
  encrypt: true,
});
console.log(zh);

// 方案二：base64
ctx.cookies.set('base64', this.encode('中文base64'));
const base64 = this.decode(ctx.cookies.get('base64'));
console.log(base64);
```

### Egg.js 中 Session 的配置和使用
- Cookie与Session区别
|  异同   | Cookie  | Session |
|  ----   | ----    | ---- |
| 存储数据  | 是，存储在浏览器 | 是，存储在浏览器、内存、或者redis等其他数据源中 |
| 操作环境  | 客户端和服务端均可操作 | 服务端操作session |
| 大小限制  | 有大小限制并且不同浏览器存储cookie的个数也有不同 | 没有大小限制但和服务器的内存的大小有关；但如果session保存到cookie里会受到浏览器的限制 |
| 是否唯一  | 是，不同用户cookie存放在各自的客户端 | 是，服务端会给每个用户创建唯一的session对象 |
| 安全问题  | 有安全隐患，通过拦截本地文件找到cookie后可以进行攻击 | 安全性高，浏览器可以获取session但难以解析 |
| 常用场景  | 判断用户是否登录 | 保存用户信息 |

- 如何操作Session
```
// 保存
ctx.session.user = body;
ctx.session.zh = '中文测试'; // 支持中文
```

// 获取session
const session = ctx.session.user;
const zhSession = ctx.session.zh;
console.log('session:', session, zhSession);

// 清除session
ctx.session.user = null;
ctx.session.zh = null;

// config.default.js session 配置key
config.session = {
  key: 'BEST',
  httpOnly: false,
  maxAge: 1000 * 5,
  renew: true,
};

- Session的拓展: 我们只需要设置 app.sessionStore，即可将 Session 存储到指定的存储中
[session拓展存储](https://eggjs.org/zh-cn/core/cookie-and-session.html#%E6%89%A9%E5%B1%95%E5%AD%98%E5%82%A8)
```
// 根目录添加app.js

'use strict';

module.exports = app => {
  const store = {};
  app.sessionStore = {
    async get(key) {
      console.log('---store---', store);
      return store[key];
    },
    async set(key, value, maxAge) {
      store[key] = value;
    },
    async destroy(key) {
      store[key] = null;
    },
  };
};

```

### Egg.js 中使用 HttpClient 请求其他接口
- 目录
/app/controller/curl.js


