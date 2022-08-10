const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Menu = require('./Menu');
const RoleMenu = require('./RoleMenu');

// 角色
const Role = sequelize.define(
  'role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING, // 角色名
  },
  {
    tableName: 'role',
    timestamps: false,
    underscored: true,
  }
);

// 角色与菜单多对多关系
Role.belongsToMany(Menu, { through: RoleMenu });
Menu.belongsToMany(Role, { through: RoleMenu });

module.exports = Role;
