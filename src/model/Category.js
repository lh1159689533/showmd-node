const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Tag = require('./Tag');

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
  },
  {
    tableName: 'category',
    timestamps: false,
    underscored: true,
  }
);

Category.hasMany(Tag);
Tag.belongsTo(Category);

module.exports = Category;
