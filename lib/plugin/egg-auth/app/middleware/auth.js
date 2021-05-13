'use strict';

module.exports = options => {
  console.log('options', options);
  return async (ctx, next) => {
    const url = ctx.request.url;
    // console.log('url', url);
    // const user = ctx.session[ctx.username];
    const user = await ctx.app.redis.get(ctx.username);

    if (!user && !options.exclude.includes(url.split('?')[0])) {
      ctx.body = {
        status: 1001,
        errMsg: '用户未登录',
      };
    } else {
      await next();
    }
  };
};
