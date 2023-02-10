const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const RoleMenu = require('./RoleMenu');
const Menu = require('./Menu');

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
Menu.belongsToMany(Role, { through: RoleMenu });
Role.belongsToMany(Menu, { through: RoleMenu });

module.exports = Role;
