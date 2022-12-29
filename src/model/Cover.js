const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 封面
const Cover = sequelize.define(
  'cover',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.BLOB, // 封面base64数据
    targetId: DataTypes.INTEGER,
    type: DataTypes.INTEGER, // 封面类型: 1 文章 2专栏
  },
  {
    tableName: 'cover',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Cover;
