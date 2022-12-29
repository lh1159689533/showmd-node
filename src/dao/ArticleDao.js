const { Op } = require('sequelize');
const sequelize = require('../db/sequelize');
const Dao = require('./Dao');
const Article = require('../model/Article');
const User = require('../model/User');

class ArticleDao extends Dao {
  constructor() {
    super(Article);
  }

  async findById(id) {
    const article = await Article.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name'] },
        // { model: Cover, attributes: ['name'] },
      ],
    });
    article.update({ readCount: article.readCount + 1 });
    return article?.toJSON();
  }

  async findAll(where, order) {
    let defaultOrder = ['readCount', 'DESC'];
    if (order === 'asc' || order === 'desc') {
      defaultOrder = ['updateTime', order];
    }
    if (where?.tags) {
      where = {
        ...where,
        tags: {
          [Op.like]: `%${where.tags}%`,
        },
      };
    }
    const articles = await Article.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      attributes: { exclude: ['content'] },
      where: {
        ...where,
        columnId: {
          [Op.or]: {
            [Op.in]: sequelize.literal(`(select id from column as clm where clm.is_private = 0)`),
            [Op.is]: null,
          },
        },
      },
      order: [defaultOrder],
    });
    return this.toJson(articles);
  }

  /**
   * 查询专栏下文章列表
   * @param {Number} columnId 专栏id
   */
  async findAllByColumnId(columnId) {
    const articles = await Article.findAll({
      attributes: { exclude: ['content'] },
      where: {
        columnId,
      },
    });
    return this.toJson(articles);
  }

  /**
   * 查询未被专栏收录的文章列表
   */
  async findAllNotInColumn(searchKey = '') {
    const articles = await Article.findAll({
      attributes: { exclude: ['content'] },
      where: {
        columnId: {
          [Op.is]: null,
        },
        name: {
          [Op.like]: `%${searchKey}%`,
        }
      },
    });
    return this.toJson(articles);
  }

  async findTop() {
    const articles = await Article.findAll({
      attributes: { exclude: ['content'] },
      order: [['readCount', 'DESC']],
      limit: 5,
    });

    return this.toJson(articles);
  }

  async findByPage(page) {
    const { pageNo, pageSize } = page;
    const articles = await Article.findAll({ offset: pageNo - 1, limit: pageSize, include: User });
    const data = {
      total: await Article.count(),
      pageNo,
      pageSize,
      list: articles?.map((article) => article?.toJSON()),
    };
    return data;
  }

  /**
   * 查询用户发布的文章
   * @param {Number} userId 用户id
   * @param {String} searchKeyword 查询关键字
   */
  async findListByUserId(userId, searchKeyword) {
    let where = {};
    if (searchKeyword) {
      where = {
        name: {
          [Op.substring]: searchKeyword,
        },
      };
    }
    const articles = await Article.findAll({
      attributes: {
        exclude: ['content'],
        include: [
          [
            sequelize.literal(`(
              select sum(ct) from (
                select count(*)  ct from comment as cm where cm.article_id = article.id union all 
                select count(*)  ct from reply as rp where rp.comment_id in (select id from comment as cm where cm.article_id = article.id)
              ))`),
            'commentCount',
          ],
        ],
      },
      where: {
        userId,
        ...where,
      },
      order: [['updateTime', 'desc']],
    });
    return this.toJson(articles);
  }

  /**
   * 批量更新文章
   * @param {Array} articleIds 文章id集合
   * @param {Object} updateData 更新的数据
   */
  async bulkUpdate(articleIds, updateData) {
    const result = await Article.update(updateData, {
      where: {
        [Article.primaryKeyAttribute]: {
          [Op.in]: articleIds,
        },
      },
    });
    return result === articleIds.length;
  }
}

module.exports = ArticleDao;
