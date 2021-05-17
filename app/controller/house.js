'use strict';

const BaseController = require('./base');


class HouseController extends BaseController {
  async hot() {
    const { ctx, app } = this;
    const result = await ctx.service.house.hot();
    this.success(result);
  }
}

module.exports = HouseController;
