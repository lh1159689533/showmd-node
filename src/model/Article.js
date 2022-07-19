const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const User = require('./User');
const Category = require('./Category');

// 文章
class Article extends Model {}

Article.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  content: DataTypes.TEXT,
  tags: DataTypes.STRING,
  summary: DataTypes.STRING,
  cover: DataTypes.TEXT,
  creator: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    references: {
      model: Category,
      key: 'value'
    }
  },
}, {
  sequelize,
  tableName: 'article'
});

// 用户与文章为一对多关系，关联外键creator
User.hasMany(Article);
Article.belongsTo(User);

// 文章必须属于一个类别，同一类别可能有多篇文章
Category.hasMany(Article);
Article.belongsTo(Category);

module.exports = Article;
