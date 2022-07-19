const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');

router.post('/showmd/article/create', async (req, res) => {
  const result = await new ArticleService().create(req.body);
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
router.post('/showmd/file/upload', multer({ preservePath: true }).array('file[]'), async (req, res) => {
  const result = await new ImageService().upload(req.files);
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
