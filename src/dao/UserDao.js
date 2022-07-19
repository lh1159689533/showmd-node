const Dao = require('./Dao');
const User = require('../model/User');

class UserDao extends Dao {
  constructor() {
    super(User);
  }
}

module.exports = UserDao;
