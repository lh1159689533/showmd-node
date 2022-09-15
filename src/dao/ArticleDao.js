const { Op } = require('sequelize');
const Dao = require('./Dao');
const Article = require('../model/Article');
const User = require('../model/User');
const Cover = require('../model/Cover');

class ArticleDao extends Dao {
  constructor() {
    super(Article);
  }

  async findById(id) {
    const article = await Article.findByPk(id, { include: [{ model: User, attributes: ['id', 'name'] }, { model: Cover, attributes: ['name'] }] });
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
      where,
      order: [defaultOrder],
    });
    // return articles?.map((article) => article?.toJSON());
    return this.toJson(articles);
  }

  async findTop() {
    const articles = await Article.findAll({
      attributes: { exclude: ['content'] },
      order: [['readCount', 'DESC']],
      limit: 5
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
}

module.exports = ArticleDao;
