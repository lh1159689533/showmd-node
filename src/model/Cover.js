const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Article = require('./Article');

// 文章封面
const Cover = sequelize.define(
  'cover',
  {
    md5: {
      // md5值
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    path: DataTypes.STRING, // 路径
    articleId: {
      // 关联文章
      type: DataTypes.STRING,
      references: {
        model: Article,
        key: 'id',
      },
    },
  },
  {
    tableName: 'cover',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Cover;
