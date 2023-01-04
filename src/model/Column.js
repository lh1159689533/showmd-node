const { DataTypes, NOW } = require('sequelize');
const dayjs = require('dayjs');
const sequelize = require('../db/sequelize');
const User = require('./User');

// 专栏
const Column = sequelize.define(
  'column',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    // articleCnt: DataTypes.INTEGER,
    subscribeCnt: { // 订阅数
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    isTop: {
      defaultValue: 0, // 是否置顶(0否 1是)
      type: DataTypes.INTEGER
    },
    isPrivate: {
      defaultValue: 0, // 是否私有(0公开 1私有)
      type: DataTypes.INTEGER
    },
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
    userId: {
      // 所属用户
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    }
  },
  {
    tableName: 'column',
    timestamps: false,
    underscored: true,
  }
);

// 用户与专栏一对多关系
User.hasMany(Column, {
  onDelete: 'RESTRICT' // 约束，删除用户时检查有无专栏关联该用户，有则不允许删除
});
Column.belongsTo(User);

module.exports = Column;
