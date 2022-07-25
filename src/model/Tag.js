const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 标签
const Tag = sequelize.define(
  'tag',
  {
    value: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    label: DataTypes.STRING,
  },
  {
    tableName: 'tag',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Tag;
