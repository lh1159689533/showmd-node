const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Article = require('./Article');

// 文章封面
const Cover = sequelize.define(
  'cover',
  {
    id: {
      // md5值
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    content: DataTypes.TEXT, // 封面base64数据
    articleId: {
      // 关联文章
      type: DataTypes.INTEGER,
      references: {
        model: Article,
        key: 'id',
      },
    },
  },
  {
    tableName: 'article_cover',
    timestamps: false,
    underscored: true,
  }
);

Article.hasOne(Cover);

module.exports = Cover;
