'use strict';

// const Service = require('egg').Service;
const md5 = require('md5');
const BaseService = require('./base');

class UserService extends BaseService {
  getUser(username, password) {
    return this.run(async () => {
      const { ctx, app } = this;
      const _where = password ? { username, password: md5(password + app.config.salt) } : { username };
      const result = await ctx.model.User.findOne({
        where: _where,
      });
      return result;
    });
  }

  async add(params) {
    return this.run(async () => {
      const { ctx } = this;
      const result = await ctx.model.User.create(params);
      return result;
    });
  }

  async edit() {
    try {

    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
