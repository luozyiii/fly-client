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
