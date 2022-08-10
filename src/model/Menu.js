const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 菜单
const Menu = sequelize.define(
  'menu',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING, // 标题
    path: DataTypes.STRING, // 路由
  },
  {
    tableName: 'menu',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Menu;
