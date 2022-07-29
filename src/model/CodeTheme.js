const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// Markdown代码主题
const CodeTheme = sequelize.define(
  'codeTheme',
  {
    value: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
    },
    label: DataTypes.STRING,
  },
  {
    tableName: 'code_theme',
    timestamps: false,
    underscored: true,
  }
);

module.exports = CodeTheme;
