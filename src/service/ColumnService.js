const logger = require('../logger');
const Response = require('../utils/Response');
const ColumnDao = require('../dao/ColumnDao');
const UserDao = require('../dao/UserDao');
const ArticleDao = require('../dao/ArticleDao');
const CoverDao = require('../dao/CoverDao');
const ImageService = require('../service/ImageService');

const { COVER_COLUMN, COLUMN_OPERATE } = require('../constant');

class ColumnService {
  constructor() {}

  /**
   * 新建/更新专栏
   * @param {Object} column 专栏
   */
  async create(column, cover) {
    const res = new Response();
    const columnDao = new ColumnDao();

    const [id, err] = await columnDao.save(column);
    if (err) {
      logger.error(`${column?.id ? '更新' : '新建'}专栏出错:`, err);
      return res.fail(`${column?.id ? '更新' : '新建'}专栏出错`);
    }
    if (column?.coverMark === 'changed') {
      this.saveCover(cover, id);
    } else if (column?.coverMark === 'deleted') {
      new CoverDao().deleteByTargetId(id, COVER_COLUMN);
    }

    logger.debug(`${column?.id ? '更新' : '新建'}专栏:`, column.name);
    return res.success(id);
  }

  /**
   * 保存专栏封面
   * @param {File} coverFile 专栏封面
   * @param {Number} columnId 专栏id
   */
  async saveCover(coverFile, columnId) {
    const coverDao = new CoverDao();
    if (!coverFile) {
      return;
    }
    const content = await new ImageService().compressAndResize(coverFile, { width: 120, height: 80 });
    let cover = await coverDao.findByTargetId(columnId, COVER_COLUMN);
    if (cover) {
      cover = { ...cover, content, type: COVER_COLUMN };
    } else {
      cover = { content, targetId: columnId, type: COVER_COLUMN };
    }
    coverDao.save(cover);
  }

  /**
   * 根据id查询专栏
   * @param {Number} id 专栏id
   */
  async findById(id) {
    const columnDao = new ColumnDao();
    const res = new Response();
    const column = await columnDao.findById(id);
    if (column) {
      const cover = await this.findColumnCover(id);
      if (cover) {
        column.cover = {
          url: `/api/showmd/column/cover/${id}`,
        };
      }
      if (column.userId) {
        const user = await new UserDao().findById(column.userId);
        column.user = {
          ...(user ?? {}),
          avatar: `/api/showmd/user/avatar/${column.userId}`,
        };
      }
      return res.success({ ...column });
    } else {
      logger.error('专栏不存在:', id);
      return res.fail('专栏不存在');
    }
  }

  /**
   * 查询文章所属专栏信息
   * @param {Number} articleId 文章id
   */
  async findByArticleId(articleId) {
    const columnDao = new ColumnDao();
    const res = new Response();
    const column = await columnDao.findByArticleId(articleId);
    if (column) {
      const cover = await this.findColumnCover(column.id);
      if (cover) {
        column.cover = {
          url: `/api/showmd/column/cover/${column.id}`,
        };
      }
    }
    return res.success(column);
  }

  /**
   * 查询用户发布的专栏
   * @param {Number} userId 用户id
   */
  async findListByUserId(userId, searchKeyword = '') {
    const columnDao = new ColumnDao();
    const res = new Response();

    const columns = await columnDao.findListByUserId(userId, searchKeyword);
    if (columns) {
      return res.success(columns.map((item) => ({ ...item, cover: `/api/showmd/column/cover/${item.id}` })));
    } else {
      logger.error('查询栏目列表出错');
      return res.fail([]);
    }
  }

  /**
   * 根据专栏id查询文章列表
   */
  async listByColumnId(columnId) {
    const articleDao = new ArticleDao();
    const columnDao = new ColumnDao();
    const res = new Response();
    const column = await columnDao.findById(columnId);
    if (!column) {
      logger.error(`专栏: ${columnId} 不存在`);
      return res.fail();
    }
    const articles = await articleDao.findAllByColumnId(columnId);
    if (articles) {
      return res.success({
        ...column,
        articles: articles.sort((a, b) => a.order - b.order),
      });
    } else {
      logger.error('查询专栏下文章列表出错');
      return res.fail();
    }
  }

  /**
   * 添加/移除/移动文章
   * @param {Number} id 专栏id
   * @param {Number} oid 原专栏id(移动文章时有效)
   * @param {Array} articleIds 文章id列表
   * @param {Number} type 0 移除文章, 1 添加文章, 2 移动文章, 3 排序文章
   */
  async articleOperate(id, oid, articleIds, type) {
    const columnDao = new ColumnDao();
    const res = new Response();
    let isSucc = false;
    let log = '';
    if (type === COLUMN_OPERATE.ADD) {
      log = '添加到专栏';
      isSucc = await columnDao.addArticle(id, articleIds);
    } else if (type === COLUMN_OPERATE.MOVE) {
      log = '移动至专栏';
      isSucc = await columnDao.moveArticle(id, oid, articleIds);
    } else if (type === COLUMN_OPERATE.SORT) {
      log = '排序';
      isSucc = await columnDao.sortArticle(id, articleIds);
    } else {
      log = '移出专栏';
      isSucc = await columnDao.removeArticle(id, articleIds);
    }
    if (isSucc) {
      logger.debug(`文章: ${articleIds.join('、')}, ${log}:${id}.`);
      return res.success(null, '操作成功');
    }
    logger.error(`文章: ${articleIds.join('、')}, ${log}:${id}, 失败`);
    return res.fail('操作失败');
  }

  /**
   * 查询未被专栏收录的文章列表
   */
  async listNotInColumn(searchKey) {
    const articleDao = new ArticleDao();
    const res = new Response();
    const articles = await articleDao.findAllNotInColumn(searchKey);
    if (articles) {
      return res.success(articles);
    } else {
      logger.error('查询文章列表出错');
      return res.fail();
    }
  }

  /**
   * 置顶/取消置顶专栏
   * @param {Number} id 专栏id
   * @param {Number} type 0 取消置顶, 1 置顶
   */
  async topColumn(id, type) {
    const columnDao = new ColumnDao();
    const res = new Response();

    const isSucc = await columnDao.top(id, type === 1);
    if (isSucc) {
      logger.error(`专栏: ${id}, ${type === 1 ? '置顶' : '取消置顶'}.`);
      return res.success(null, `${type === 1 ? '置顶' : '取消置顶'}成功`);
    }
    logger.error(`专栏: ${id}, ${type === 1 ? '置顶' : '取消置顶'}失败`);
    return res.fail(`${type === 1 ? '置顶' : '取消置顶'}失败`);
  }

  /**
   * 删除用户发布的专栏
   * @param {Number} id 用户id
   */
  async deleteById(id) {
    const columnDao = new ColumnDao();
    const res = new Response();

    const relates = await columnDao.findAllByColumId(id);
    if (relates?.length) {
      return res.fail('专栏下有文章, 无法删除');
    }
    const isSucc = await columnDao.delete(id);
    if (isSucc) {
      new CoverDao().deleteByTargetId(id, COVER_COLUMN);
      logger.debug(`专栏: ${id}, 删除成功.`);
      return res.success(null, '专栏删除成功');
    }
    logger.error(`专栏: ${id}, 删除失败`);
    return res.fail(`专栏: ${id}, 删除失败`);
  }

  /**
   * 根据专栏id查询封面
   * @param {Number} columnId 专栏id
   */
  async findColumnCover(columnId) {
    const coverDao = new CoverDao();
    const cover = await coverDao.findByTargetId(columnId, COVER_COLUMN);
    if (cover) {
      return cover.content;
    }
    return '';
  }
}

module.exports = ColumnService;
