'use strict';

const BaseService = require('./base');

class CommentService extends BaseService {
  async add(params) {
    return this.run(async ctx => {
      const result = await ctx.model.Comment.create(params);
      return result;
    });

  }
  async lists(params) {
    return this.run(async (ctx, app) => {
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
        ],
      });
      return result;
    });

  }
}

module.exports = CommentService;
