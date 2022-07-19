const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 标签
class Tag extends Model {}

Tag.init({
  value: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: false,
  },
  label: DataTypes.STRING
}, { sequelize, tableName: 'tag', timestamps: false });

module.exports = Tag;
