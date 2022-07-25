const dayjs = require('dayjs');
const logger = require('../logger');
const Response = require('../utils/Response');
const ArticleDao = require('../dao/ArticleDao');
const CoverDao = require('../dao/CoverDao');
const ImageService = require('../service/ImageService');
const githubService = require('../service/GithubService');

class ArticleService {
  constructor() {}

  async create(article, cover) {
    const fileData = await this.uploadCover(cover);
    const res = new Response();
    if (!fileData) {
      logger.error(`文章封面上传失败:`, article?.name);
      return res.fail('文章封面上传失败');
    }
    const articleDao = new ArticleDao();
    const [id, err] = await articleDao.save(article);
    if (id) {
      new CoverDao().save({ md5: fileData?.sha, path: fileData?.path, articleId: id });
      return res.success(id);
    }
    logger.error('新建文章出错:', err);
    return res.fail();
  }

  async update(article, cover) {
    const fileName = await this.uploadCover(cover);
    const res = new Response();
    if (!fileName) {
      logger.error(`文章封面上传失败:`, article?.name);
      return res.fail('文章封面上传失败');
    }
    const articleDao = new ArticleDao();
    article.cover = fileName;
    const [isSucc, err] = await articleDao.update(article);
    if (isSucc) {
      return res.success(article, '文章更新成功');
    }
    logger.error('文章更新出错:', err);
    return res.fail();
  }

  async uploadCover(coverFile) {
    const [name] = coverFile.originalname.split('.');
    const fileName = `cover/${dayjs().format('YYYY-MM-DD')}/${name}.webp`
    const content = await new ImageService().compress(coverFile);
    return await githubService.saveFileContent(fileName, content);
  }

  async list() {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findAll();
    if (articles) {
      return res.success(articles);
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
      article.cover = {
        name: article.cover,
        url: `/api/showmd/file/preview?filename=${encodeURI(article.cover)}`
      };
      return res.success(article);
    } else {
      logger.error('文章不存在:', id);
      return res.fail('文章不存在');
    }
  }
}

module.exports = ArticleService;
