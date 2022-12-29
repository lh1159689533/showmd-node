const Dao = require('./Dao');
const Cover = require('../model/Cover');

class CoverDao extends Dao {
  constructor() {
    super(Cover);
  }

  /**
   * 查封面
   * @param {Number} targetId
   * @param {Number} type 封面类型: 1 文章 2专栏
   */
  async findByTargetId(targetId, type) {
    try {
      const cover = await Cover.findOne({ where: { targetId, type } });
      return cover?.toJSON();
    } catch (e) {
      return null;
    }
  }

  /**
   * 删除封面
   * @param {Number} targetId
   * @param {Number} type 封面类型: 1 文章 2专栏
   */
  async deleteByTargetId(targetId, type) {
    const result = await Cover.destroy({ where: { targetId, type } });
    return result !== 0;
  }
}

module.exports = CoverDao;
