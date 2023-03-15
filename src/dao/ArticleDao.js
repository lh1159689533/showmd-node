const { Op } = require('sequelize');
const sequelize = require('../db/sequelize');
const Dao = require('./Dao');
const ColumnDao = require('./ColumnDao');
const Article = require('../model/Article');
const User = require('../model/User');

class ArticleDao extends Dao {
  constructor() {
    super(Article);
  }

  async findById(id) {
    const article = await Article.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'name'] }],
    });
    article?.update({ readCount: article.readCount + 1 });
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
        id: {
          [Op.notIn]: sequelize.literal(`(select ca.article_id from column as clm, column_article as ca where ca.column_id = clm.id and clm.is_private = 1)`),
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
          [sequelize.literal(`(select \`order\` from column_article as ca where ca.column_id = ${columnId} and ca.article_id = article.id)`), 'order'],
        ],
      },
      where: {
        id: {
          [Op.in]: sequelize.literal(`(select article_id from column_article as ca where ca.column_id = ${columnId})`),
        },
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
        id: {
          [Op.notIn]: sequelize.literal(`(select article_id from column_article)`),
        },
        name: {
          [Op.like]: `%${searchKey}%`,
        },
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
   * 获取专栏上一篇文章
   * @param {Number} articleId 文章id
   */
  async findSameColumnArticle(articleId, type) {
    try {
      const result = await Article.findOne({
        attributes: ['id', 'name'],
        where: {
          id: {
            [Op.eq]: sequelize.literal(
              `(select sca.article_id from column_article as tca, column_article as sca where tca.article_id = ${articleId} and sca.\`order\` ${
                type === 'next' ? '>' : '<'
              } tca.\`order\` and sca.column_id = tca.column_id)`
            ),
          },
        },
      });
      return this.toJson(result);
    } catch {
      return null;
    }
  }

  async relateCloumn(articleId, columnId) {
    const columnDao = new ColumnDao();
    await columnDao.deleteByArticleId(articleId);
    await columnDao.addArticle(columnId, [articleId]);
  }
}

module.exports = ArticleDao;
