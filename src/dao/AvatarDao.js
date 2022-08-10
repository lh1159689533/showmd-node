const Dao = require('./Dao');
const Avatar = require('../model/Avatar');

class AvatarDao extends Dao {
  constructor() {
    super(Avatar);
  }

  async findByUserId(userId) {
    try {
      const avatar = await Avatar.findOne({ where: { userId } });
      return avatar?.toJSON();
    } catch (e) {
      return null;
    }
  }
}

module.exports = AvatarDao;
