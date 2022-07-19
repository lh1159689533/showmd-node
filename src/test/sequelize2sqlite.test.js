// const { Model, DataTypes } = require('sequelize');

const sequelize = require('../db/sequelize');

// class User extends Model {
// }

// User.init({
//   id: {
//     type: DataTypes.BIGINT,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   name: DataTypes.STRING,
//   age: DataTypes.INTEGER
// }, { sequelize, modelName: 'user', tableName: 'user' });

// class UserDao {
//   constructor() {
//   }
//   async save(user) {
//     return await User.create(user);
//   }
//   async update(user) {
//     const result = await User.update(user, { where: { id: user.id }});
//     return result !== 0;
//   }
//   async findById(id) {
//     const user = await User.findByPk(id);
//     return user?.toJSON();
//   }
//   async findAll() {
//     const users = await User.findAll();
//     return users?.map(user => user?.toJSON());
//   }
//   async findByPage(page) {
//     const users = await User.findAll({ offset: page.pageNow, limit: pageSize });
//     return users?.map(user => user?.toJSON());
//   }
//   async delete(id) {
//     const result = await User.destroy({ where: { id }});
//     return result !== 0;
//   }
// }

const UserDao = require('../dao/UserDao');
// const fs = require('fs').promises;
// const path = require('path');


(async () => {
  // const models = await fs.readdir(path.resolve('src/model'));
  // models.forEach(model => {
  //   require(path.resolve(`src/model/${model}`));
  // });
  // console.log(models);
  // await sequelize.sync();
  const userDao = new UserDao();
  userDao.save({ name: 'hh', password: '123' });

  // const user = await userDao.findById(6);
  // user.age = 33;
  // user.id = 8;
  // const result = await userDao.update(user);

  // const result = await userDao.delete(7);
  // console.log('result:', result);
  // console.log(user);

  // const users = await userDao.findByPage({ pageNo: 1, pageSize: 10 });
  // const users = await userDao.findAll();
  // console.log(users);
})();