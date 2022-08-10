const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const Role = require('./Role');

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
    roleId: {
      // 关联角色
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
    }
  },
  {
    tableName: 'user',
    timestamps: false,
    underscored: true,
  }
);

// 用户与角色一对多关系
Role.hasMany(User);
User.belongsTo(Role);

module.exports = User;
