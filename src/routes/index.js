const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');

router.post('/showmd/article/create', multer({ preservePath: true }).single('cover'), async (req, res) => {
  const article = JSON.parse(req.body.article);
  const result = await new ArticleService().create(article, req.file);
  res.send(result);
});

router.get('/showmd/article/list', async (_, res) => {
  const result = await new ArticleService().list();
  res.send(result);
});

router.get('/showmd/article/findById', async (req, res) => {
  const result = await new ArticleService().findById(req.query.id);
  res.send(result);
});

// preservePath保存包含文件名的完整文件路径
router.post('/showmd/file/upload', multer({ preservePath: true }).single('file[]'), async (req, res) => {
  const result = await new ImageService().upload(req.file);
  res.send(result);
});

router.get('/showmd/file/preview', async (req, res) => {
  const result = await new ImageService().preview(req.query.filename);
  res.send(result);
});

router.get('/showmd/article/cover/:id', async (req, res) => {
  const result = await new ArticleService().findArticleCover(req.params.id);
  res.send(result);
});

router.get('/showmd/theme/content/list', async (req, res) => {
  const result = await new ThemeService().listContentTheme();
  res.send(result);
});

router.get('/showmd/theme/code/list', async (req, res) => {
  const result = await new ThemeService().listCodeTheme();
  res.send(result);
});

// router.get('/showmd/test', async (req, res) => {
//   const db = new DB();
//   db.insert('test', [['a']], ['name']);
//   res.send('ok');
// });

module.exports = router;
