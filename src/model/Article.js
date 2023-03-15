const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const User = require('./User');

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
    editorType: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
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
User.hasMany(Article, {
  onDelete: 'RESTRICT' // 约束，删除用户时检查有无文章关联该用户，有则不允许删除
});
Article.belongsTo(User);

// 专栏与文章为一对多关系
// Column.hasMany(Article, {
//   onDelete: 'SET NULL' // 删除专栏时，关联该专栏的文章外键置为NULL
// });
// Article.belongsTo(Column);

module.exports = Article;
