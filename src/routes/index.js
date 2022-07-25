const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');

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
  console.log('req.file:', req.file);
  const result = await new ImageService().upload(req.file);
  res.send(result);
});

router.get('/showmd/file/preview', async (req, res) => {
  const result = await new ImageService().preview(req.query.filename);
  res.send(result);
});

// router.get('/showmd/test', async (req, res) => {
//   const db = new DB();
//   db.insert('test', [['a']], ['name']);
//   res.send('ok');
// });

module.exports = router;
