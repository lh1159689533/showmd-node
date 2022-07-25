const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db/sequelize');
const dayjs = require('dayjs');

// 用户
const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
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
    tableName: 'user',
    timestamps: false,
    underscored: true,
  }
);

module.exports = User;
