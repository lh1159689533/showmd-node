const express = require('express');
const router = express.Router();
const multer = require('multer');
const ArticleService = require('../service/ArticleService');
const ImageService = require('../service/ImageService');
const ThemeService = require('../service/ThemeService');
const CategoryService = require('../service/CategoryService');
const UserService = require('../service/UserService');
const RoleMenuService = require('../service/RoleMenuService');

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
router.get('/showmd/list/article', async (_, res) => {
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

module.exports = router;
