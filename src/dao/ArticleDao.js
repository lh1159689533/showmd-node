const Dao = require('./Dao');
const Article = require('../model/Article');
const User = require('../model/User');

class ArticleDao extends Dao {
  constructor() {
    super(Article);
  }
  async findById(id) {
    const article = await Article.findByPk(id, { include: User });
    return article?.toJSON();
  }
  async findAll() {
    const articles = await Article.findAll({ include: User });
    return articles?.map((article) => article?.toJSON());
  }
  async findByPage(page) {
    const { pageNo, pageSize } = page;
    const articles = await Article.findAll({ offset: pageNo - 1, limit: pageSize, include: User });
    const data = {
      total: await Article.count(),
      pageNo,
      pageSize,
      list: articles?.map((article) => article?.toJSON())
    }
    return data;
  }
}

module.exports = ArticleDao;
