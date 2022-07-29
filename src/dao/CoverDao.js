const Dao = require('./Dao');
const Cover = require('../model/Cover');

class CoverDao extends Dao {
  constructor() {
    super(Cover);
  }

  async findByArticleId(articleId) {
    try {
      const cover = await Cover.findOne({ where: { articleId } });
      return cover?.toJSON();
    } catch (e) {
      return null;
    }
  }

  async deleteByArticleId(articleId) {
    const result = await Cover.destroy({ where: { articleId } });
    return result !== 0;
  }
}

module.exports = CoverDao;
