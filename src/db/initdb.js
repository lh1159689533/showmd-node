/**
 * 部署项目前，需执行，初始化数据库表
 */
const fs = require('fs').promises;
const path = require('path');
const sequelize = require('./sequelize');

(async () => {
  try {
    console.log('初始化数据库表.');
    await sequelize.authenticate();
    const models = await fs.readdir(path.resolve('src/model'));
    models.forEach((model) => {
      require(path.resolve(`src/model/${model}`));
    });
    await sequelize.sync();
    console.log('数据库表已成功初始化.');
  } catch (error) {
    console.error('数据库表初始化失败:', error);
  }
})();
