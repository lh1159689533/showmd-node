const Dao = require('./Dao');
const Article = require('../model/Article');
const User = require('../model/User');
const Cover = require('../model/Cover');

class ArticleDao extends Dao {
  constructor() {
    super(Article);
  }

  async findById(id) {
    const article = await Article.findByPk(id, { include: [User, { model: Cover, attributes: ['name'] }] });
    article.update({ readCount: article.readCount + 1 });
    return article?.toJSON();
  }

  async findAll() {
    const articles = await Article.findAll({ include: [{ model: User, attributes: ['id', 'name'] }], attributes: { exclude: ['content'] } });
    return articles?.map((article) => article?.toJSON());
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
