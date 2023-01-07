const Dao = require('./Dao');
const sequelize = require('../db/sequelize');
const { Op } = require('sequelize');
const Column = require('../model/Column');
const logger = require('../logger');

class ColumnDao extends Dao {
  constructor() {
    super(Column);
  }

  async findById(id) {
    const column = await Column.findByPk(id, {
      attributes: {
        include: [[sequelize.literal(`(select count(*) from article as art where art.column_id = column.id)`), 'articleCnt']],
      },
    });
    return column?.toJSON();
  }

  /**
   * 根据用户id查询专栏
   * @param {Number} userId 用户id
   * @param {String} searchKeyword 查询关键字
   */
  async findListByUserId(userId, searchKeyword = '') {
    try {
      const columns = await Column.findAll({
        attributes: {
          include: [[sequelize.literal(`(select count(*) from article as art where art.column_id = column.id)`), 'articleCnt']],
        },
        where: {
          userId,
          name: {
            [Op.like]: `%${searchKeyword}%`,
          },
        },
        order: [
          ['isTop', 'desc'],
          ['createTime', 'desc'],
        ],
      });
      return this.toJson(columns);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * 置顶/取消置顶专栏
   * @param {Number} id 专栏id
   */
  async top(id, isTop) {
    const [isSucc] = await this.update({ id, isTop });
    return isSucc;
  }
}

module.exports = ColumnDao;
