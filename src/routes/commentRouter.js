const express = require('express');
const router = express.Router();
const CommentService = require('../service/CommentService');
const auth = require('../middleware/auth');

/**
 * 查询文章下全部评论
 */
router.get('/list', async (req, res) => {
  const result = await new CommentService().list(req.query.id, req.query.type);
  res.send(result);
});

/**
 * 添加评论/回复
 */
router.put('/save/:type', auth, async (req, res) => {
  const result = await new CommentService().create({ ...req.body, userId: req.currentUser?.id }, req.params.type);
  res.send(result);
});

/**
 * 删除评论/回复
 */
router.delete('/delete', auth, async (req, res) => {
  const result = await new CommentService().deleteById(req.query.id, req.query.type);
  res.send(result);
});

/**
 * 点赞评论/回复
 */
router.post('/:type/digg', auth, async (req, res) => {
  const result = await new CommentService().digg({ ...req.body, userId: req.currentUser?.id }, req.params.type);
  res.send(result);
});

/**
 * 取消点赞评论/回复
 */
router.post('/:type/undigg', auth, async (req, res) => {
  const result = await new CommentService().undigg({ ...req.body, userId: req.currentUser?.id }, req.params.type);
  res.send(result);
});

module.exports = router;
