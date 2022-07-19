const Dao = require('./Dao');
const Category = require('../model/Category');

class CategoryDao extends Dao {
  constructor() {
    super(Category);
  }
}

module.exports = CategoryDao;