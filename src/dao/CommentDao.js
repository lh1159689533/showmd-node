const { Op } = require('sequelize');
const Dao = require('./Dao');
const User = require('../model/User');
const Comment = require('../model/Comment');
const Reply = require('../model/Reply');

class CommentDao extends Dao {
  constructor() {
    super(Comment);
  }

  async findById(id) {
    const comment = await Comment.findOne({
      include: { model: User, attributes: ['id', 'name'] },
      where: {
        id,
      },
    });

    return comment?.toJSON();
  }

  async findListByArticleId(articleId) {
    const list = await Comment.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      where: {
        articleId,
      },
      order: [['createTime', 'DESC']],
    });
    const commentList = this.toJson(list);
    let total = commentList.length;
    for (const c of commentList) {
      const { count, rows } = await Reply.findAndCountAll({
        include: [
          { model: User, attributes: ['id', 'name'] },
          { model: User, as: 'replyToUser', attributes: ['id', 'name'] },
        ],
        where: {
          commentId: c.id,
        },
        limit: 2,
        order: [['createTime', 'ASC']],
      });
      c.replies = this.toJson(rows);
      c.replyCount = count;
      total += count;
    }

    return {
      count: total,
      list: commentList
    };
  }

  /**
   * 评论点赞
   * @param {Number} commentId 评论id
   * @param {Number} articleId 文章id
   * @param {Number} userId 用户id
   */
  async incrementDigg({ commentId, articleId, userId }) {
    const comment = await Comment.findOne({ where: { [Op.and]: [{ id: commentId }, { articleId }] } });
    if (comment) {
      const diggUsers = (comment.diggUsers ?? '').concat(`${userId},`);
      const digg = comment.digg + 1;
      await comment.update({ diggUsers, digg });
      return true;
    }
    return false;
  }

  /**
   * 评论取消点赞
   * @param {Number} commentId 评论id
   * @param {Number} articleId 文章id
   * @param {Number} userId 用户id
   */
  async decrementDigg({ commentId, articleId, userId }) {
    const comment = await Comment.findOne({ where: { [Op.and]: [{ id: commentId }, { articleId }] } });
    if (comment) {
      const diggUsers = comment.diggUsers?.replace(`${userId},`, '');
      const digg = comment.digg - 1;
      await comment.update({ diggUsers, digg });
      return true;
    }
    return false;
  }
}

module.exports = CommentDao;
