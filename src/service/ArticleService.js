const logger = require('../logger');
const Response = require('../utils/Response');
const ArticleDao = require('../dao/ArticleDao');
const CoverDao = require('../dao/CoverDao');
const ImageService = require('../service/ImageService');

class ArticleService {
  constructor() {}

  /**
   * 新建/更新文章
   * @param {Object} article 文章
   * @param {File} cover 文章封面
   */
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

  /**
   * 保存文章封面
   * @param {File} coverFile 文章封面
   * @param {Number} articleId 文章id
   * @param {String} articleName 文章名称
   */
  async saveCover(coverFile, articleId, articleName) {
    const coverDao = new CoverDao();
    if (!coverFile) {
      return;
    }
    const name = `${articleName}_cover.webp`;
    logger.info(name);
    const content = await new ImageService().compressAndResize(coverFile, { width: 120, height: 80 });
    let cover = await coverDao.findByArticleId(articleId);
    if (cover) {
      cover = { ...cover, name, content };
    } else {
      cover = { name, content, articleId };
    }
    coverDao.save(cover);
  }

  /**
   * 文章列表
   */
  async list(params) {
    const filters = params?.filters ?? {};
    const order = params?.order ?? null;
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findAll(filters, order);
    if (articles) {
      return res.success(articles.map(item => ({ ...item, cover: `/api/showmd/article/cover/${item.id}` })));
    } else {
      logger.error('查询文章列表出错');
      return res.fail([]);
    }
  }

  /**
   * 热门文章列表
   */
  async toplist() {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findTop();
    if (articles) {
      return res.success(articles);
    } else {
      logger.error('查询文章列表出错');
      return res.fail([]);
    }
  }

  /**
   * 根据id查询文章
   * @param {Number} id 文章id
   */
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

  /**
   * 根据文章id查询文章封面
   * @param {Number} articleId 文章id
   */
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
