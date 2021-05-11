'use strict';

// 创建子进程
const { exec, spawn } = require('child_process');

// 创建子进程，并将结果缓存起来，返回给回调函数
exec('cat a.js', (error, stdout, stderr) => {
  if (error) {
    console.log('报错了：', error);
    return;
  }
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
});

// 使用指定的命令行参数创建新进程
const ls = spawn('ls', [ '-a' ], { encoding: 'utf8' });

ls.stdout.on('data', data => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', data => {
  console.log(`stderr: ${data}`);
});

ls.on('close', code => {
  console.log(`子进程退出，退出码:${code}`);
});
