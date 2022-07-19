const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

// 用户
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, tableName: 'user' }
);

module.exports = User;
