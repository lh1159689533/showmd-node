const Dao = require('./Dao');
const Cover = require('../model/Cover');

class CoverDao extends Dao {
  constructor() {
    super(Cover);
  }
}

module.exports = CoverDao;
