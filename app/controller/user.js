'use strict';

const Controller = require('egg').Controller;
const md5 = require('md5');

class UserController extends Controller {
  async register() {
    const { ctx, app } = this;
    const parmas = ctx.request.body;
    const user = await ctx.service.user.getUser(parmas.username);
    if (user) {
      ctx.body = {
        status: 500,
        errMsg: '用户已存在',
      };
      return;
    }
    const result = await ctx.service.user.add(
      {
        ...parmas,
        password: md5(parmas.password) + app.config.salt,
        createTime: ctx.helper.time(),
      });
    if (result) {
      // console.log(result);
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(result.dataValues, [ 'password' ]),
          createTime: ctx.helper.timestamp(result.createTime),
        },
      };
    } else {
      ctx.body = {
        status: 500,
        errMsg: '注册用户失败',
      };
    }
  }

  async login() {
    const { ctx } = this;
    const { username, password } = await ctx.request.body;
    const user = await ctx.service.user.getUser(username, password);
    if (user) {
      ctx.session.userId = user.id;
      ctx.body = {
        status: 200,
        data: {
          ...ctx.helper.unPick(user.dataValues, [ 'password' ]),
          createTime: ctx.helper.timestamp(user.createTime),
        },
      };
    } else {
      ctx.body = {
        status: 500,
        errMsg: '该用户不存在',
      };
    }
  }
}

module.exports = UserController;

