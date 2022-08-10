const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Role = require('./Role');
const Menu = require('./Menu');

// 角色与菜单关联表
const RoleMenu = sequelize.define(
  'roleMenu',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
    },
    menuId: {
      type: DataTypes.INTEGER,
      references: {
        model: Menu,
        key: 'id',
      },
    },
  },
  {
    tableName: 'role_menu',
    timestamps: false,
    underscored: true,
  }
);

module.exports = RoleMenu;
