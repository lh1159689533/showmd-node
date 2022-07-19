const { Sequelize } = require('sequelize');
const path = require('path');
const {
  db: { dialect, storage },
} = require('../config');

module.exports = new Sequelize({
  dialect,
  storage: path.resolve(storage),
});
