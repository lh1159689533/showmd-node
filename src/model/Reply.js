const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const User = require('./User');
const Comment = require('./Comment');

// 评论的回复
const Reply = sequelize.define(
  'reply',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.STRING, // 内容
    digg: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }, // 点赞数
    diggUsers: DataTypes.STRING, // 点赞用户id列表,逗号分隔
    parentId: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }, // 父id
    commentId: {
      // 评论
      type: DataTypes.INTEGER,
      references: {
        model: Comment,
        key: 'id',
      },
    },
    replyToUserId: {
      // 回复的对象用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    userId: {
      // 写回复的用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    createTime: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      get() {
        return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    }
  },
  {
    tableName: 'reply',
    timestamps: false,
    underscored: true,
  }
);

// 评论与回复一对多
Comment.hasMany(Reply);
Reply.belongsTo(Comment);

// 用户与回复一对多
User.hasMany(Reply);
Reply.belongsTo(User);
Reply.belongsTo(User, { as: 'replyToUser' });

module.exports = Reply;
