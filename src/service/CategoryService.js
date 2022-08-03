const Response = require('../utils/Response');
const CategoryDao = require('../dao/CategoryDao');
const TagDao = require('../dao/TagDao');
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

  async listSubCategory() {
    const [result, err] = await new TagDao().findAll();
    const res = new Response();
    if (err) {
      logger.error('查询子类别出错:', err);
      return res.fail('查询子类别出错');
    }
    return res.success(result);
  }
}

module.exports = CategoryService;