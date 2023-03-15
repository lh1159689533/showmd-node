const express = require('express');
const router = express.Router();
const multer = require('multer');
const ColumnService = require('../service/ColumnService');

/**
 * 新建/更新专栏
 */
router.post('/update', multer({ preservePath: true }).single('cover'), async (req, res) => {
  const column = JSON.parse(req.body.column);
  const result = await new ColumnService().create(column, req.file);
  res.send(result);
});

/**
 * 查询用户发布的专栏
 */
router.get('/list', async (req, res) => {
  const result = await new ColumnService().findListByUserId(req.query.userId, req.query.searchKey);
  res.send(result);
});

/**
 * 添加/移除/移动文章
 */
router.post('/operate', async (req, res) => {
  const { id, oid, articleIds, action } = req.body ?? {};
  const result = await new ColumnService().articleOperate(id, oid, articleIds, action);
  res.send(result);
});

/**
 * 根据id查询专栏下文章列表
 */
router.get('/findArticleList', async (req, res) => {
  const result = await new ColumnService().listByColumnId(req.query.id);
  res.send(result);
});

/**
 * 查询未被专栏收录的文章列表
 */
router.get('/listNotInColumn', async (req, res) => {
  const result = await new ColumnService().listNotInColumn(req.query.searchKey);
  res.send(result);
});

/**
 * 置顶/取消置顶专栏
 */
router.post('/topColumn', async (req, res) => {
  const { id, action } = req.body ?? {};
  const result = await new ColumnService().topColumn(id, action);
  res.send(result);
});

/**
 * 删除专栏
 */
router.delete('/delete/:id', async (req, res) => {
  const result = await new ColumnService().deleteById(req.params.id);
  res.send(result);
});

/**
 * 专栏封面
 */
router.get('/cover/:id', async (req, res) => {
  const result = await new ColumnService().findColumnCover(req.params.id);
  res.send(result);
});

/**
 * 根据id查询专栏
 */
router.get('/findById', async (req, res) => {
  const result = await new ColumnService().findById(req.query.id);
  res.send(result);
});

/**
 * 根据文章id查询专栏
 */
router.get('/findByArticleId', async (req, res) => {
  const result = await new ColumnService().findByArticleId(req.query.articleId);
  res.send(result);
});

/**
 * 专栏下文章排序
 */
router.post('/sortArticle', async (req, res) => {
  const result = await new ColumnService().sortArticle(req.body.columnId, req.body.articleIds);
  res.send(result);
});

module.exports = router;