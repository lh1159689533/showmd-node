const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');
const CategoryService = require('../service/CategoryService');
const RoleMenuService = require('../service/RoleMenuService');
const FileService = require('../service/FileService');

const holidayConf = require('../config/holiday.config');

const columnRouter = require('./columnRouter');
const articleRouter = require('./articleRouter');
const commentRouter = require('./commentRouter');
const userRouter = require('./userRouter');
// const resourceRouter = require('./resourceRouter');

const currentUser = require('../middleware/currentUser');

router.use('/column', columnRouter);
router.use('/article', articleRouter);
router.use('/comment', commentRouter);
router.use('/user', userRouter);
// router.use('/resource', resourceRouter);

router.get('/holiday', (_, res) => {
  res.send(JSON.stringify({ data: holidayConf }));
});

/**
 * Markdown上传图片
 * preservePath保存包含文件名的完整文件路径
 */
router.post('/file/upload', multer({ preservePath: true }).single('file'), async (req, res) => {
  const result = await new ImageService().upload(req.file);
  res.send(result);
});

/**
 * Markdown分片上传图片
 * preservePath保存包含文件名的完整文件路径
 */
router.post('/file/sliceUpload', multer({ preservePath: true }).single('chunk'), async (req, res) => {
  const { uploadId, chunkNum } = req.query;
  const result = await new ImageService().sliceUpload(req.file, uploadId, chunkNum, req.body);
  res.send(result);
});

/**
 * 预览图片
 */
router.get('/file/preview/:id', async (req, res) => {
  const result = await new ImageService().preview(req.params.id);
  res.send(result);
});

/**
 * Markdown内容主题列表
 */
router.get('/list/theme/content', async (req, res) => {
  const result = await new ThemeService().listContentTheme();
  res.send(result);
});

/**
 * Markdown代码主题列表
 */
router.get('/list/theme/code', async (req, res) => {
  const result = await new ThemeService().listCodeTheme();
  res.send(result);
});

/**
 * 文章分类列表
 */
router.get('/list/category', async (_, res) => {
  const result = await new CategoryService().listCategory();
  res.send(result);
});

/**
 * 根据角色id查询菜单列表
 */
router.get('/list/menu', currentUser, async (req, res) => {
  const result = await new RoleMenuService().listMenu(req.currentUser?.roleId);
  res.send(result);
});

/**
 * 图片处理
 */
router.post('/image/process', multer({ preservePath: true }).single('file'), async (req, res) => {
  const result = await new ImageService().process(req.file, req.body);
  res.send(result);
});

/**
 * 图片处理
 */
router.post('/image/download', multer({ preservePath: true }).single('file'), async (req, res) => {
  const result = await new ImageService().process(req.file, req.body, true, res);
  res.send(result);
});

router.get('/sse', async (req, res) => {
  const result = await new ImageService().sse(res);
  res.send(result);
});

/**
 * Markdown上传附件(目前支持html上传到本地md-demo)
 */
router.post('/attachfile/upload', multer({ preservePath: true }).single('attachfile'), async (req, res) => {
  const result = await new FileService().upload(req.file);
  res.send(result);
});

module.exports = router;
