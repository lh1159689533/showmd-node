const logger = require('../logger');
const Response = require('../utils/Response');
const ArticleDao = require('../dao/ArticleDao');

class ArticleService {
  constructor() {
  }

  async create(article) {
    const articleDao = new ArticleDao();
    const res = new Response();
    const [id, err] = await articleDao.save(article)
    if (id) {
      return res.success(id).toString();
    } else {
      logger.error('新建文章出错:', err);
    }
    return res.fail().toString();
  }

  async list() {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findAll();
    if (articles) {
      return res.success(articles).toString();
    } else {
      logger.error('查询文章列表出错');
      return res.fail([]).toString();
    }
  }

  async findById(id) {
    const articleDao = new ArticleDao();
    const res = new Response();
    const article = await articleDao.findById(id);
    if (articlerr) {
      return res.success(article).toString();
    } else {
      logger.error('查询文章出错:', id);
      return res.fail(null).toString();
    }
  }
}

module.exports = ArticleService;