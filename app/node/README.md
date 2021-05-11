## node 知识整理

### node 进程 process
目录 /app/node/process

#### child_procss模块
- exec
使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。
```
// child_process.js

child_process.exec(command[, options], callback)
```

- spawn
使用指定的命令行参数创建新进程
```
child_process.spawn(command[, args][, options])
```


- cluter模块
```
// cluster

```

- master进程和cluter进程的通信
```
// child.js
'use strict';

console.log(`子进程${process.pid}`);

process.on('message', msg => {
  console.log(`来自master：${msg}`);
});
process.send('这是子进程');


// master.js
'use strict';

const { fork } = require('child_process');
const child = fork('./child.js');

child.on('message', msg => {
  console.log(`来自子进程:${msg}`);
});

child.send('来自master');

// 执行
node master.js
```