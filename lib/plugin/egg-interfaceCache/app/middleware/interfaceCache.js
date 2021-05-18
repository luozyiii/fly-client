'use strict';
/** 缓存接口
 * 1，接口地址作为redis中的key
 * 2，查询redis，有缓存，返回返回接口
 * 3，没有缓存，将接口返回结果保存到redis中
 */
module.exports = options => {
  return async (ctx, next) => {
    const { url } = ctx.request;
    if (options.include.includes(url)) {
      const cahce = await ctx.app.redis.get(url);
      if (cahce) {
        ctx.body = JSON.parse(cahce);
        return;
      }
      await next();
      await ctx.app.redis.set(url, JSON.stringify(ctx.response.body), 'EX', 8);

    } else {
      await next();
    }

  };
};
