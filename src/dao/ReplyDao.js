const { Op } = require('sequelize');
const Dao = require('./Dao');
const User = require('../model/User');
const Reply = require('../model/Reply');

class ReplyDao extends Dao {
  constructor() {
    super(Reply);
  }

  async findById(id) {
    const reply = await Reply.findOne({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: User, as: 'replyToUser', attributes: ['id', 'name'] },
      ],
      where: { id }
    });

    return reply?.toJSON();
  }

  async findListByCommentId(commentId) {
    const { count, rows } = await Reply.findAndCountAll({
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: User, as: 'replyToUser', attributes: ['id', 'name'] },
      ],
      where: {
        commentId,
      },
      order: [['createTime', 'ASC']],
    });

    return {
      count,
      list: this.toJson(rows)
    };
  }

  /**
   * 删除回复及其子回复
   * @param {Number} id 回复id
   * @returns 删除是否成功
   */
  async deleteById(id) {
    const result = await Reply.destroy({
      where: {
        [Op.or]: [{ id }, { parentId: id }],
      },
    });

    return result !== 0;
  }

  /**
   * 根据评论id删除该评论的所有回复
   * @param {Number} commentId 评论id
   * @returns 删除是否成功
   */
  async deleteByCommentId(commentId) {
    const result = Reply.destroy({
      where: {
        commentId,
      },
    });

    return result !== 0;
  }

  /**
   * 评论点赞
   * @param {Number} commentId 评论id
   * @param {Number} replyId 回复id
   * @param {Number} userId 用户id
   */
  async incrementDigg({ commentId, replyId, userId }) {
    const reply = await Reply.findOne({ where: { [Op.and]: [{ id: replyId }, { commentId }] } });
    if (reply) {
      const diggUsers = (reply.diggUsers ?? '').concat(`${userId},`);
      const digg = reply.digg + 1;
      await reply.update({ diggUsers, digg });
      return true;
    }
    return false;
  }

  /**
   * 评论取消点赞
   * @param {Number} commentId 评论id
   * @param {Number} replyId 回复id
   * @param {Number} userId 用户id
   */
  async decrementDigg({ commentId, replyId, userId }) {
    const reply = await Reply.findOne({ where: { [Op.and]: [{ id: replyId }, { commentId }] } });
    if (reply) {
      const diggUsers = reply.diggUsers?.replace(`${userId},`, '');
      const digg = reply.digg - 1;
      await reply.update({ diggUsers, digg });
      return true;
    }
    return false;
  }
}

module.exports = ReplyDao;
