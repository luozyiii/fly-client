'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 数据库查询
  async lists() {
    try {
      const { ctx, app } = this;
      // mysql 操作数据
      // const res = await app.mysql.select('user');

      // egg-sequelize 查询数据
      const res = await ctx.model.User.findAll({
        where: {
          id: 2,
        },
        // limit: 1,
        // offset: 0,
      });

      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async detail(id) {
    // return {
    //   id,
    //   name: 'leslie',
    //   age: 18,
    // };

    // egg-sequelize 查询数据
    const { ctx } = this;
    const res = await ctx.model.User.findByPk(id);

    return res;
  }

  // 通过id查询数据
  async detail2(id) {
    try {
      const { app } = this;
      const res = await app.mysql.get('user', { id });
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 数据库新增数据
  async add(params) {
    try {
      const { app, ctx } = this;
      // const res = await app.mysql.insert('user', params);

      // egg-sequelize 新增数据
      const res = await ctx.model.User.create(params);

      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 数据库修改数据
  async edit(params) {
    try {
      const { app, ctx } = this;
      // const res = await app.mysql.update('user', params);

      // egg-sequelize 修改数据
      const user = await ctx.model.User.findByPk(params.id);
      if (!user) {
        return {
          status: 404,
          errMsg: 'id不存在',
        };
      }
      const res = await user.update(params);
      return {
        status: 200,
        data: res,
      };

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // 删除数据
  async delete(id) {
    try {
      const { app, ctx } = this;
      // const res = await app.mysql.delete('user', { id });

      // // egg-sequelize 删除数据
      const user = await ctx.model.User.findByPk(id);
      if (!user) {
        return {
          status: 404,
          errMsg: 'id不存在',
        };
      }
      const res = await user.destroy(id);
      return {
        status: 200,
        data: res,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserService;
