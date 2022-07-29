const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// Markdown内容主题
const ContentTheme = sequelize.define(
  'contentTheme',
  {
    value: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    label: DataTypes.STRING,
    path: DataTypes.STRING
  },
  {
    tableName: 'content_theme',
    timestamps: false,
    underscored: true,
  }
);

module.exports = ContentTheme;
