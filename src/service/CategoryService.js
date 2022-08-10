const Response = require('../utils/Response');
const CategoryDao = require('../dao/CategoryDao');
const logger = require('../logger');

class CategoryService {
  constructor() {}

  async listCategory() {
    const [result, err] = await new CategoryDao().findAll();
    const res = new Response();
    if (err) {
      logger.error('查询类别出错:', err);
      return res.fail('查询类别出错');
    }
    return res.success(result);
  }
}

module.exports = CategoryService;