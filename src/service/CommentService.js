const logger = require('../logger');
const Response = require('../utils/Response');
const CommentDao = require('../dao/CommentDao');
const ReplyDao = require('../dao/ReplyDao');
const {
  user: { avatarPrefix },
} = require('../config');

class CommentService {
  constructor() {}

  /**
   * 新建/更新评论
   * @param {Object} comment 评论
   */
  async create(data, type) {
    if (type === 'comment') {
      return await this.createComment(data);
    }

    return await this.createReply(data);
  }

  /**
   * 新建/更新评论
   * @param {Object} comment 评论
   */
  async createComment(comment) {
    const res = new Response();
    const commentDao = new CommentDao();
    const [id, err] = await commentDao.save(comment);
    if (err) {
      logger.error('新建评论出错', err);
      return res.fail('新建评论出错');
    }

    const newComment = await commentDao.findById(id);
    if (newComment.user) {
      newComment.user.avatar = `${avatarPrefix}/${newComment.user.id}`;
    }
    newComment.replies = [];

    return res.success(newComment);
  }

  /**
   * 新建/更新评论的回复
   * @param {Object} reply 评论的回复
   */
  async createReply(reply) {
    const res = new Response();
    const replyDao = new ReplyDao();
    const [id, err] = await replyDao.save(reply);
    if (err) {
      logger.error('新建回复出错', err);
      return res.fail('新建回复出错');
    }

    const newReply = await replyDao.findById(id);
    if (newReply.user) {
      newReply.user.avatar = `${avatarPrefix}/${newReply.user.id}`;
    }
    if (newReply.replyToUser) {
      newReply.replyToUser.avatar = `${avatarPrefix}/${newReply.replyToUser.id}`;
    }

    return res.success(newReply);
  }

  async list(id, type) {
    console.log(id, type)
    if (type === 'comment') {
      return this.listComment(id);
    } else {
      return this.listReply(id);
    }
  }

  /**
   * 查询文章下全部评论
   * @param {Number} articleId 文章id
   */
  async listComment(articleId) {
    const res = new Response();
    const { count, list } = await new CommentDao().findListByArticleId(articleId);
    if (list) {
      list.forEach((comment) => {
        if (comment.user) {
          comment.user.avatar = `${avatarPrefix}/${comment.user.id}`;
        }
        if (comment.replies?.length) {
          comment.replies.forEach((reply) => {
            if (reply.user) {
              reply.user.avatar = `${avatarPrefix}/${reply.user.id}`;
            }
            if (reply.replyToUser) {
              reply.replyToUser.avatar = `${avatarPrefix}/${reply.replyToUser.id}`;
            }
          });
        }
      });
      const commentData = {
        id: articleId,
        list,
        count,
      };

      return res.success(commentData);
    }

    logger.error('查询评论出错：', articleId);
    return res.fail();
  }

  /**
   * 查询评论下全部回复
   * @param {Number} commentId 评论id
   */
  async listReply(commentId) {
    const res = new Response();
    const { list, count } = await new ReplyDao().findListByCommentId(commentId);
    if (list?.length) {
      list.forEach((reply) => {
        if (reply.user) {
          reply.user.avatar = `${avatarPrefix}/${reply.user.id}`;
        }
        if (reply.replyToUser) {
          reply.replyToUser.avatar = `${avatarPrefix}/${reply.replyToUser.id}`;
        }
      });
      const replyData = {
        id: commentId,
        list,
        count,
      };

      return res.success(replyData);
    }

    logger.error('查询评论下全部回复出错：', commentId);
    return res.fail();
  }

  /**
   * 新建/更新评论/回复
   * @param {Number} id 评论/回复id
   */
  async deleteById(id, type) {
    if (type === 'comment') {
      return this.deleteCommentById(id);
    }

    return this.deleteReplyById(id);
  }

  /**
   * 删除评论
   * @param {Number} id
   */
  async deleteCommentById(id) {
    const res = new Response();
    const isDel = await new CommentDao().delete(id);
    if (!isDel) {
      return res.fail(`删除评论出错`);
    }
    // 删除该评论下的所有回复
    new ReplyDao()
      .deleteByCommentId(id)
      .then((isDel) => {
        !isDel && logger.error(`删除评论: ${id}, 下回复失败!`);
      })
      .catch((e) => {
        logger.error(`删除评论: ${id}, 下回复出错: `, e);
      });

    return res.success(isDel);
  }

  /**
   * 删除评论的回复
   * @param {Number} id
   */
  async deleteReplyById(id) {
    const res = new Response();
    const isDel = await new ReplyDao().deleteById(id);
    if (!isDel) {
      return res.fail(`删除回复出错`);
    }

    return res.success(isDel);
  }

  async digg(params, type) {
    if (type === 'comment') {
      return this.diggComment(params);
    } else {
      return this.diggReply(params);
    }
  }

  async undigg(params, type) {
    if (type === 'comment') {
      return this.undiggComment(params);
    } else {
      return this.undiggReply(params);
    }
  }

  /**
   * 点赞评论
   * @param {Number} commentId 评论id
   * @param {Number} articleId 文章id
   * @param {Number} userId 用户id
   */
  async diggComment({ commentId, articleId, userId }) {
    const res = new Response();
    const isSucc = await new CommentDao().incrementDigg({ commentId, articleId, userId });
    if (!isSucc) {
      return res.fail();
    }

    return res.success(isSucc);
  }

  /**
   * 点赞回复
   * @param {Number} commentId 评论id
   * @param {Number} replyId 回复id
   * @param {Number} userId 用户id
   */
  async diggReply({ commentId, replyId, userId }) {
    const res = new Response();
    const isSucc = await new ReplyDao().incrementDigg({ commentId, replyId, userId });
    if (!isSucc) {
      return res.fail();
    }

    return res.success(isSucc);
  }

  /**
   * 取消点赞评论
   * @param {Number} commentId 评论id
   * @param {Number} articleId 文章id
   * @param {Number} userId 用户id
   */
  async undiggComment({ commentId, articleId, userId }) {
    const res = new Response();
    const isSucc = await new CommentDao().decrementDigg({ commentId, articleId, userId });
    if (!isSucc) {
      return res.fail();
    }

    return res.success(isSucc);
  }

  /**
   * 取消点赞回复
   * @param {Number} commentId 评论id
   * @param {Number} replyId 回复id
   * @param {Number} userId 用户id
   */
  async undiggReply({ commentId, replyId, userId }) {
    const res = new Response();
    const isSucc = await new ReplyDao().decrementDigg({ commentId, replyId, userId });
    if (!isSucc) {
      return res.fail();
    }

    return res.success(isSucc);
  }
}

module.exports = CommentService;
