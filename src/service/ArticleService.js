const logger = require('../logger');
const Response = require('../utils/Response');
const ArticleDao = require('../dao/ArticleDao');
const CoverDao = require('../dao/CoverDao');
const ImageService = require('../service/ImageService');

class ArticleService {
  constructor() {}

  async create(article, cover) {
    const res = new Response();
    const articleDao = new ArticleDao();
    const [id, err] = await articleDao.save(article);
    if (err) {
      logger.error(`${article?.id ? '更新' : '新建'}文章出错:`, err);
      return res.fail(`${article?.id ? '更新' : '新建'}文章出错`);
    }
    if (article?.coverMark === 'changed') {
      this.saveCover(cover, id, article.name);
    } else if (article?.coverMark === 'deleted') {
      new CoverDao().deleteByArticleId(id);
    }

    return res.success(id);
  }

  async saveCover(coverFile, articleId, articleName) {
    const coverDao = new CoverDao();
    if (!coverFile) {
      return;
    }
    const name = `${articleName}_cover.webp`;
    logger.info(name);
    const content = await new ImageService().compressAndResize(coverFile, { width: 160, height: 120 });
    let cover = await coverDao.findByArticleId(articleId);
    if (cover) {
      cover = { ...cover, name, content };
    } else {
      cover = { name, content, articleId };
    }
    coverDao.save(cover);
  }

  async list() {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findAll();
    if (articles) {
      return res.success(articles.map(item => ({ ...item, cover: `/api/showmd/article/cover/${item.id}` })));
    } else {
      logger.error('查询文章列表出错');
      return res.fail([]);
    }
  }

  async findById(id) {
    const articleDao = new ArticleDao();
    const res = new Response();
    const article = await articleDao.findById(id);
    if (article) {
      if (article.cover) {
        article.cover = {
          name: article.cover?.name,
          url: `/api/showmd/article/cover/${id}`,
        };
      }
      if (article.user) {
        article.user = {
          ...article.user,
          avatar: `/api/showmd/user/avatar/${article.user.id}`
        };
      }
      return res.success({ ...article });
    } else {
      logger.error('文章不存在:', id);
      return res.fail('文章不存在');
    }
  }

  async findArticleCover(articleId) {
    const coverDao = new CoverDao();
    const cover = await coverDao.findByArticleId(articleId);
    if (cover) {
      return cover.content;
    }
    return '';
  }
}

module.exports = ArticleService;
