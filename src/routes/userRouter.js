const express = require('express');
const router = express.Router();
const UserService = require('../service/UserService');
const auth = require('../middleware/auth');

/**
 * 用户登录
 */
router.post('/login', async (req, res) => {
  const result = await new UserService().login(req, res);
  res.send(result);
});

/**
 * 用户注册
 */
router.post('/register', async (req, res) => {
  const result = await new UserService().register(req, res);
  res.send(result);
});

/**
 * 新建/更新专栏
 */
router.post('/update', auth, async (req, res) => {
  const result = await new UserService().create(req.body);
  res.send(result);
});

/**
 * 校验用户名唯一性
 */
router.get('/check', async (req, res) => {
  const result = await new UserService().checkUserName(req.query.userName);
  res.send(result);
});

/**
 * 查询登录用户信息
 */
router.get('/info', async (req, res) => {
  const result = await new UserService().findUserInfo(req.currentUser);
  res.send(result);
});

/**
 * 根据id查询用户
 */
router.get('/:id', async (req, res) => {
  const result = await new UserService().findUserById(req.params.id);
  res.send(result);
});

/**
 * 根据用户id查询用户头像
 */
router.get('/avatar/:id', async (req, res) => {
  const result = await new UserService().findUserAvatar(req.params.id);
  res.send(result);
});

module.exports = router;
