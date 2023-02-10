const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Column = require('./Column');
const Article = require('./Article');

// 专栏与文章关联表
const ColumnArticle = sequelize.define(
  'columnArticle',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    columnId: {
      type: DataTypes.INTEGER,
      references: {
        model: Column,
        key: 'id',
      },
    },
    articleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Article,
        key: 'id',
      },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  },
  {
    tableName: 'column_article',
    timestamps: false,
    underscored: true,
  }
);

// 专栏与文章多对多关系(注意：目前为一对多，设计为多对多方便后期扩展)
Column.belongsToMany(Article, { through: ColumnArticle, onDelete: 'CASCADE' });
Article.belongsToMany(Column, { through: ColumnArticle, onDelete: 'CASCADE' });

module.exports = ColumnArticle;
