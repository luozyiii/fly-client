'use strict';

const BaseService = require('./base');

class HouseService extends BaseService {
  // 公用参数
  commonAttr(app) {
    return {
      order: [
        [ 'showCount', 'DESC' ],
      ],
      attributes: {
        exclude: [ 'startTime', 'endTime', 'publishTime' ],
      },
      include: [
        {
          model: app.model.Imgs,
          limit: 1,
          attributes: [ 'url' ],
        },
      ],
    };
  }
  async hot() {
    return this.run(async (ctx, app) => {
      const result = await ctx.model.House.findAll({
        ...this.commonAttr(app),
        limit: 4,
      });
      return result;
    });
  }

  async search(params) {
    return this.run(async (ctx, app) => {
      const { lte, gte, like } = app.Sequelize.Op;
      const { pageNum, pageSize, code, startTime, endTime, houseSubmitName } = params;
      const where = {
        cityCode: Array.isArray(code) ? code[0] : code,
        startTime: {
          [lte]: startTime,
          [gte]: endTime,
        },
        name: {
          [like]: `%${houseSubmitName}%`,
        },
      };
      if (!houseSubmitName) {
        delete where.name;
      }
      const result = await ctx.model.House.findAll({
        ...this.commonAttr(app),
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
        where,
      });
      return result;
    });
  }
}

module.exports = HouseService;
