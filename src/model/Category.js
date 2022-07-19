const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 分类
class Category extends Model {}

Category.init({
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: false,
  },
  label: DataTypes.STRING
}, { sequelize, tableName: 'category', timestamps: false });

module.exports = Category;
