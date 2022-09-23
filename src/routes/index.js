const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');
const CategoryService = require('../service/CategoryService');
const UserService = require('../service/UserService');
const RoleMenuService = require('../service/RoleMenuService');
const CommentService = require('../service/CommentService');

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
router.post('/showmd/list/article', async (req, res) => {
  const result = await new ArticleService().list(req.body);
  res.send(result);
});

/**
 * 热门文章列表
 */
router.post('/showmd/toplist/article', async (req, res) => {
  const result = await new ArticleService().toplist(req.body);
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
router.post('/showmd/file/upload', multer({ preservePath: true }).single('file'), async (req, res) => {
  const result = await new ImageService().upload(req.file);
  res.send(result);
});

/**
 * Markdown分片上传图片
 * preservePath保存包含文件名的完整文件路径
 */
router.post('/showmd/file/sliceUpload', multer({ preservePath: true }).single('chunk'), async (req, res) => {
  const { uploadId, chunkNum } = req.query;
  const result = await new ImageService().sliceUpload(req.file, uploadId, chunkNum, req.body);
  res.send(result);
});

/**
 * 预览图片
 */
router.get('/showmd/file/preview/:id', async (req, res) => {
  const result = await new ImageService().preview(req.params.id);
  res.send(result);
});

/**
 * 文章封面
 */
router.get('/showmd/article/cover/:id', async (req, res) => {
  const result = await new ArticleService().findArticleCover(req.params.id);
  res.send(result);
});

/**
 * Markdown内容主题列表
 */
router.get('/showmd/list/theme/content', async (req, res) => {
  const result = await new ThemeService().listContentTheme();
  res.send(result);
});

/**
 * Markdown代码主题列表
 */
router.get('/showmd/list/theme/code', async (req, res) => {
  const result = await new ThemeService().listCodeTheme();
  res.send(result);
});

/**
 * 文章分类列表
 */
router.get('/showmd/list/category', async (_, res) => {
  const result = await new CategoryService().listCategory();
  res.send(result);
});

/**
 * 根据id查询用户
 */
router.get('/showmd/user/:id', async (req, res) => {
  const result = await new UserService().findUserById(req.params.id);
  res.send(result);
});

/**
 * 根据用户id查询用户头像
 */
router.get('/showmd/user/avatar/:id', async (req, res) => {
  const result = await new UserService().findUserAvatar(req.params.id);
  res.send(result);
});

/**
 * 根据角色id查询菜单列表
 */
router.get('/showmd/list/menu/:roleId', async (req, res) => {
  const result = await new RoleMenuService().listMenuByRoleId(req.params.roleId);
  res.send(result);
});

/**
 * 查询文章下全部评论
 */
router.get('/showmd/list/:type/:id', async (req, res) => {
  const result = await new CommentService().list(req.params.id, req.params.type);
  res.send(result);
});

/**
 * 添加评论/回复
 */
router.put('/showmd/save/:type', async (req, res) => {
  const result = await new CommentService().create(req.body, req.params.type);
  res.send(result);
});

/**
 * 删除评论/回复
 */
router.delete('/showmd/delete/:type/:id', async (req, res) => {
  const result = await new CommentService().deleteById(req.params.id, req.params.type);
  res.send(result);
});

/**
 * 点赞评论/回复
 */
router.post('/showmd/:type/digg', async (req, res) => {
  const result = await new CommentService().digg(req.body, req.params.type);
  res.send(result);
});

/**
 * 取消点赞评论/回复
 */
router.post('/showmd/:type/undigg', async (req, res) => {
  const result = await new CommentService().undigg(req.body, req.params.type);
  res.send(result);
});

module.exports = router;
