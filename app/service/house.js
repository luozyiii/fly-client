'use strict';

const BaseService = require('./base');

class HouseService extends BaseService {
  async hot() {
    return this.run(async (ctx, app) => {
      const result = await ctx.model.House.findAll({
        limit: 4,
        order: [
          [ 'showCount', 'DESC' ],
        ], // 根据字段排序
        attributes: {
          exclude: [ 'publishTime', 'startTime', 'endTime' ],
        }, // 排除返回的字段
        include: [
          {
            model: app.model.Imgs,
            limit: 1,
            attributes: [ 'url' ],
          },
        ], // 与Imgs图片表关联
      });
      return result;
    });
  }
}

module.exports = HouseService;
