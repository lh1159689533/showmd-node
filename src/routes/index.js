const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');
const CategoryService = require('../service/CategoryService');

/**
 * 新建文章
 */
router.post('/showmd/article/create', multer({ preservePath: true }).single('cover'), async (req, res) => {
  const article = JSON.parse(req.body.article);
  const result = await new ArticleService().create(article, req.file);
  res.send(result);
});

/**
 * 文章列表
 */
router.get('/showmd/article/list', async (_, res) => {
  const result = await new ArticleService().list();
  res.send(result);
});

/**
 * 根据id查询文章
 */
router.get('/showmd/article/findById', async (req, res) => {
  const result = await new ArticleService().findById(req.query.id);
  res.send(result);
});

/**
 * Markdown上传图片
 * preservePath保存包含文件名的完整文件路径
 */
router.post('/showmd/file/upload', multer({ preservePath: true }).single('file[]'), async (req, res) => {
  const result = await new ImageService().upload(req.file);
  res.send(result);
});

/**
 * 预览图片(github图片服务器)
 */
router.get('/showmd/file/preview', async (req, res) => {
  const result = await new ImageService().preview(req.query.filename);
  res.send(result);
});

/**
 * 预览图片(本地库图片)
 */
router.get('/showmd/article/cover/:id', async (req, res) => {
  const result = await new ArticleService().findArticleCover(req.params.id);
  res.send(result);
});

/**
 * Markdown内容主题列表
 */
router.get('/showmd/theme/content/list', async (req, res) => {
  const result = await new ThemeService().listContentTheme();
  res.send(result);
});

/**
 * Markdown代码主题列表
 */
router.get('/showmd/theme/code/list', async (req, res) => {
  const result = await new ThemeService().listCodeTheme();
  res.send(result);
});

/**
 * 文章分类列表
 */
router.get('/showmd/category/list', async (_, res) => {
  const result = await new CategoryService().listCategory();
  res.send(result);
});

/**
 * 文章子分类列表
 */
router.get('/showmd/tag/list', async (_, res) => {
  const result = await new CategoryService().listSubCategory();
  res.send(result);
});

module.exports = router;
