const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./User');
const dayjs = require('dayjs');

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
    userId: {
      // 关联用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
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

module.exports = Article;
