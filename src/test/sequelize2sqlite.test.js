// const { Model, DataTypes, NOW } = require('sequelize');
// const dayjs = require('dayjs');

const sequelize = require('../db/sequelize');
// const TagDao = require('../dao/TagDao');
// const ArticleDao = require('../dao/ArticleDao');
const Cover = require('../model/Cover');
const Article = require('../model/Article');


(async () => {
  // sequelize.sync({ force: true });
  const result = await Cover.destroy({ where: { articleId: 1 } });
  console.log(result);
  // User.create({ name: 'dsds', password: '222' });
})();
