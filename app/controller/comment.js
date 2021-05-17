'use strict';

const BaseController = require('./base');

class CommentsController extends BaseController {
  async add() {
    const { ctx } = this;
    const user = await ctx.service.user.getUser(ctx.username);
    const result = await ctx.service.comment.add(
      {
        userId: user.id,
        houseId: ctx.params('houseId'),
        msg: ctx.params('comment'),
        createTime: ctx.helper.time(),
      });
    this.success(result);
  }

  async lists() {
    const { ctx } = this;
    const user = await ctx.service.user.getUser(ctx.username);
    const result = await ctx.service.comment.lists({
      userId: user.id,
      ...ctx.params(),
      houseId: ctx.params('id'),
    });
    this.success(result);
  }
}

module.exports = CommentsController;
