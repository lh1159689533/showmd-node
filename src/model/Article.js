const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const User = require('./User');
const Column = require('./Column');

// 文章
const Article = sequelize.define(
  'article',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    tags: DataTypes.STRING,
    category: DataTypes.STRING,
    summary: DataTypes.STRING,
    codeTheme: DataTypes.STRING,
    contentTheme: DataTypes.STRING,
    readCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    userId: {
      // 关联用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    columnId: {
      // 所属专栏
      type: DataTypes.INTEGER,
      references: {
        model: Column,
        key: 'id',
      },
    },
    createTime: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      get() {
        return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updateTime: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      get() {
        return dayjs(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  },
  {
    tableName: 'article',
    timestamps: false,
    underscored: true,
  }
);

// 用户与文章为一对多关系
User.hasMany(Article);
Article.belongsTo(User);

// 专栏与文章为一对多关系
Column.hasMany(Article);
Article.belongsTo(Column);

module.exports = Article;
