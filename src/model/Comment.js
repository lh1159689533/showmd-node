const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const User = require('./User');
const Article = require('./Article');

// 评论
const Comment = sequelize.define(
  'comment',
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
    articleId: {
      // 文章
      type: DataTypes.INTEGER,
      references: {
        model: Article,
        key: 'id',
      },
    },
    userId: {
      // 评论用户
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
    tableName: 'comment',
    timestamps: false,
    underscored: true,
  }
);

// 文章与评论一对多
Article.hasMany(Comment);
Comment.belongsTo(Article);

// 用户与评论一对多
User.hasMany(Comment);
Comment.belongsTo(User);

module.exports = Comment;
