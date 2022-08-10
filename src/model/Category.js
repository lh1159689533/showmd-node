const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 分类
const Category = sequelize.define(
  'category',
  {
    value: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    label: DataTypes.STRING,
    parentValue: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'category',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Category;
