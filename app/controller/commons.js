'use strict';

const BaseController = require('./base');

class CommonsController extends BaseController {
  async city() {
    try {
      const { ctx, app } = this;
      const result = await app.httpclient.request('https://apis.imooc.com/?icode=89773B5DA84CA283', { dataType: 'json' });
      if (result.status === 200) {
        // this.success(result.data.citys);
        // 没有icode 故先写死数据
        this.success([
          [{ label: '广州', value: '10001' },
            { label: '深圳', value: '10002' }],
        ]);
      } else {
        this.error('获取城市数据失败');
      }
    } catch (error) {
      this.error('获取城市数据失败');
    }

  }
}

module.exports = CommonsController;
