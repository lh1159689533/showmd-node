const logger = require('../logger');
const Response = require('../utils/Response');
const ArticleDao = require('../dao/ArticleDao');
const CoverDao = require('../dao/CoverDao');
const ImageService = require('../service/ImageService');

const { COVER_ARTICLE } = require('../constant');

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
    const { columnId, ...art } = article;
    const [id, err] = await articleDao.save(art);
    if (err) {
      logger.error(`${article?.id ? '更新' : '新建'}文章出错:`, err);
      return res.fail(`${article?.id ? '更新' : '新建'}文章出错`);
    }
    if (+columnId) {
      await articleDao.relateCloumn(id, +columnId);
    }
    if (article?.coverMark === 'changed') {
      this.saveCover(cover, id);
    } else if (article?.coverMark === 'deleted') {
      new CoverDao().deleteByTargetId(id, COVER_ARTICLE);
    }

    logger.debug(`${article?.id ? '更新' : '新建'}文章:`, article?.name);
    return res.success(id);
  }

  /**
   * 保存文章封面
   * @param {File} coverFile 文章封面
   * @param {Number} articleId 文章id
   */
  async saveCover(coverFile, articleId) {
    const coverDao = new CoverDao();
    if (!coverFile) {
      return;
    }
    // const name = `${articleName}_cover.webp`;
    const content = await new ImageService().compressAndResize(coverFile, { width: 120, height: 80 });
    let cover = await coverDao.findByTargetId(articleId, COVER_ARTICLE);
    if (cover) {
      cover = { ...cover, content, type: COVER_ARTICLE };
    } else {
      cover = { content, targetId: articleId, type: COVER_ARTICLE };
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
      return res.success(
        articles.map((item) => ({
          ...item,
          cover: `/api/showmd/article/cover/${item.id}`,
          user: { ...(item.user ?? {}), avatar: `/api/showmd/user/avatar/${item.user?.id}` },
        }))
      );
    } else {
      logger.error('查询文章列表失败');
      return res.fail('查询文章列表失败');
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
      logger.error('查询热门文章列表失败');
      return res.fail('查询热门文章列表失败');
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
      const cover = await this.findArticleCover(id);
      if (cover) {
        article.cover = {
          url: `/api/showmd/article/cover/${id}`,
        };
      }
      if (article.user) {
        article.user = {
          ...article.user,
          avatar: `/api/showmd/user/avatar/${article.user.id}`,
        };
      }
      return res.success({ ...article });
    } else {
      logger.error('文章不存在:', id);
      return res.fail('文章不存在');
    }
  }

  /**
   * 根据用户id查询文章
   * @param {Number} userId 用户id
   */
  async findByUserId(userId, searchKeyword = '') {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findListByUserId(userId, searchKeyword);
    return res.success(articles ?? []);
  }

  /**
   * 根据文章id查询文章封面
   * @param {Number} articleId 文章id
   */
  async findArticleCover(articleId) {
    const coverDao = new CoverDao();
    const cover = await coverDao.findByTargetId(articleId, COVER_ARTICLE);
    if (cover) {
      return cover.content;
    }
    return '';
  }

  /**
   * 获取专栏上/下一篇文章
   * @param {Number} articleId 文章id
   */
  async findSameColumnArticle(articleId, type = 'next') {
    const articleDao = new ArticleDao();
    const res = new Response();
    const article = await articleDao.findSameColumnArticle(articleId, type);
    return res.success(article);
  }

  async delete(articleId) {
    logger.debug(`删除文章：${articleId}.`);
    const articleDao = new ArticleDao();
    const res = new Response();
    try {
      const isDel = await articleDao.delete(articleId);
      if (isDel) {
        return res.success();
      }
      return res.fail('删除失败');
    } catch (e) {
      return res.fail(e?.message);
    }
  }
}

module.exports = ArticleService;
