const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../logger');
const {
  db: { dialect, storage },
} = require('../config');

module.exports = new Sequelize({
  dialect,
  storage: path.resolve(storage),
  logging: msg => logger.debug(msg),
});
