const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db/sequelize');
const dayjs = require('dayjs');

// markdown图片内容
const Image = sequelize.define(
  'image',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    content: DataTypes.BLOB, // base64数据
    createTime: {
      type: DataTypes.DATE,
      defaultValue: NOW,
      get() {
        return dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  },
  {
    tableName: 'article_image',
    timestamps: false,
    underscored: true,
  }
);

module.exports = Image;
