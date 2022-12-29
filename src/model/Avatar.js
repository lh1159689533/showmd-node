const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./User');

// 用户头像
const Avatar = sequelize.define(
  'avatar',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: DataTypes.BLOB, // 头像base64数据
    userId: {
      // 关联用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'avatar',
    timestamps: false,
    underscored: true,
  }
);

User.hasOne(Avatar);

module.exports = Avatar;
