const Dao = require('./Dao');
const Tag = require('../model/Tag');

class TagDao extends Dao {
  constructor() {
    super(Tag);
  }
}

module.exports = TagDao;
