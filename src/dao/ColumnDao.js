const Dao = require('./Dao');
const sequelize = require('../db/sequelize');
const { Op } = require('sequelize');
const Column = require('../model/Column');
const ColumnArticle = require('../model/ColumnArticle');
const logger = require('../logger');

class ColumnDao extends Dao {
  constructor() {
    super(Column);
  }

  async findById(id) {
    const column = await Column.findByPk(id, {
      attributes: {
        include: [[sequelize.literal(`(select count(*) from column_article as ca where ca.column_id = column.id)`), 'articleCnt']],
      },
    });
    return column?.toJSON();
  }

  /**
   * 查询文章所属专栏信息
   * @param {Number} articleId 文章id
   */
  async findByArticleId(articleId) {
    const column = await Column.findOne({
      where: {
        id: {
          [Op.eq]: sequelize.literal(`(select ca.column_id from column_article as ca where ca.article_id = ${articleId})`)
        }
      },
      attributes: {
        include: [[sequelize.literal(`(select count(*) from column_article as ca where ca.column_id = column.id)`), 'articleCnt']],
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
          include: [[sequelize.literal(`(select count(*) from column_article as ca where ca.column_id = column.id)`), 'articleCnt']],
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

  /**
   * 全删全增
   * @param {Array} columnId 专栏id
   * @param {Array} articleIds 文章id集合
   */
  async saveList(columnId, articleIds) {
    try {
      const columnArticles = articleIds.map((aid, index) => ({
        columnId,
        articleId: aid,
        order: index
      }));
      await this.deleteByColumId(columnId);
      const result = await ColumnArticle.bulkCreate(columnArticles);
      return result?.length === articleIds.length;
    } catch {
      return false;
    }
  }

  /**
   * 专栏添加文章(支持批量添加,全删全增)
   * @param {Number} columnId 专栏id
   * @param {Number} articleId 文章id集合
   */
  async addArticle(columnId, articleIds) {
    try {
      const articles = await this.findAllByColumId(columnId);
      const result = await this.saveList(columnId, [...articleIds, ...articles.map(art => art.articleId)]);
      return result;
    } catch {
      return false;
    }
  }

  /**
   * 移动文章至专栏(支持批量移动)
   * @param {Number} columnId 专栏id
   * @param {Number} oldColumnId 原专栏id
   * @param {Number} articleId 文章id集合
   */
  async moveArticle(columnId, oldColumnId, articleIds) {
    await this.removeArticle(oldColumnId, articleIds);
    return await this.addArticle(columnId, articleIds);
  }

  /**
   * 专栏下文章排序
   * @param {Number} columnId 专栏id
   * @param {Number} articleId 文章id集合(有序)
   */
  async sortArticle(columnId, articleIds) {
    return await this.saveList(columnId, articleIds);
  }

  /**
   * 专栏移除文章(支持批量移除)
   * @param {Number} columnId 专栏id
   * @param {Number} articleIds 文章id集合
   */
  async removeArticle(columnId, articleIds) {
    const articles = await this.findAllByColumId(columnId);
    return await this.saveList(columnId, articles.filter(art => !articleIds.includes(art.articleId)).map(art => art.articleId));
  }

  /**
   * 查询该专栏与文章的所有关联
   * @param {Number} columnId 专栏id
   */
  async findAllByColumId(columnId) {
    const list = await ColumnArticle.findAll({ where: { columnId }, order: [['order', 'asc']] });
    return this.toJson(list ?? []);
  }

  /**
   * 删除该专栏与文章的所有关联
   * @param {Number} columnId 专栏id
   */
  async deleteByColumId(columnId) {
    await ColumnArticle.destroy({ where: { columnId } });
  }
}

module.exports = ColumnDao;
