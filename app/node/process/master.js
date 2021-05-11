'use strict';

const { fork } = require('child_process');
const child = fork('./child.js');

child.on('message', msg => {
  console.log(`来自子进程:${msg}`);
});

child.send('来自master');
