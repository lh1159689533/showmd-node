const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const auth = require('../middleware/auth');

/**
 * 新建/更新文章
 */
router.post('/update', auth, multer({ preservePath: true }).single('cover'), async (req, res) => {
  const article = JSON.parse(req.body.article);
  const result = await new ArticleService().create({ ...article, userId: req.currentUser?.id }, req.file);
  res.send(result);
});

/**
 * 文章列表
 */
router.post('/list', async (req, res) => {
  const result = await new ArticleService().list(req.body);
  res.send(result);
});

/**
 * 热门文章列表
 */
router.post('/toplist', async (req, res) => {
  const result = await new ArticleService().toplist(req.body);
  res.send(result);
});

/**
 * 根据id查询文章
 */
router.get('/findById', async (req, res) => {
  const result = await new ArticleService().findById(req.query.id);
  res.send(result);
});

/**
 * 查询用户发布的文章
 */
router.get('/listArticleByUser', auth, async (req, res) => {
  const result = await new ArticleService().findByUserId(req.currentUser?.id, req.query.searchKey);
  res.send(result);
});

/**
 * 文章封面
 */
router.get('/cover/:id', async (req, res) => {
  const result = await new ArticleService().findArticleCover(req.params.id);
  res.send(result);
});

/**
 * 获取专栏下一篇文章
 */
router.post('/next', async (req, res) => {
  const result = await new ArticleService().findSameColumnArticle(req.body.articleId, 'next');
  res.send(result);
});

/**
 * 获取专栏上一篇文章
 */
router.post('/prev', async (req, res) => {
  const result = await new ArticleService().findSameColumnArticle(req.body.articleId, 'prev');
  res.send(result);
});

router.delete('/delete/:id', auth, async (req, res) => {
  const result = await new ArticleService().delete(req.params.id);
  res.send(result);
});

module.exports = router;
