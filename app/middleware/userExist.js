'use strict';
/**
 * 检测用户是否存在 中间件
 * @param {*} options
 * @return
 */
module.exports = options => {
  return async (ctx, next) => {
    const user = await ctx.service.user.getUser(ctx.username);
    if (!user) {
      ctx.body = {
        status: 500,
        errMsg: '用户不存在',
      };
      return;
    }
    await next();
  };
};
