const Dao = require('./Dao');
const sequelize = require('../db/sequelize');
const User = require('../model/User');

class UserDao extends Dao {
  constructor() {
    super(User);
  }

  async findById(id) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password', 'roleId'],
        include: [
          [sequelize.literal(`(select count(*) from article as art where art.user_id = user.id)`), 'articleCnt'], // 用户文章数
          [sequelize.literal(`(select count(*) from column as clm where clm.user_id = user.id)`), 'columnCnt'], // 用户专栏数
        ],
      },
    });
    return user?.toJSON();
  }
}

module.exports = UserDao;
