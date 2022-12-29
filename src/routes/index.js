const express = require('express');
const router = express.Router();
const multer = require('multer');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');
const CategoryService = require('../service/CategoryService');
const UserService = require('../service/UserService');
const RoleMenuService = require('../service/RoleMenuService');

const columnRouter = require('./columnRouter');
const articleRouter = require('./articleRouter');
const commentRouter = require('./commentRouter');

router.use('/column', columnRouter);
router.use('/article', articleRouter);
router.use('/comment', commentRouter);

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
 * 根据id查询用户
 */
router.get('/user/:id', async (req, res) => {
  const result = await new UserService().findUserById(req.params.id);
  res.send(result);
});

/**
 * 根据用户id查询用户头像
 */
router.get('/user/avatar/:id', async (req, res) => {
  const result = await new UserService().findUserAvatar(req.params.id);
  res.send(result);
});

/**
 * 根据角色id查询菜单列表
 */
router.get('/list/menu/:roleId', async (req, res) => {
  const result = await new RoleMenuService().listMenuByRoleId(req.params.roleId);
  res.send(result);
});

module.exports = router;
