const Response = require('../utils/Response');
const UserDao = require('../dao/UserDao');
const AvatarDao = require('../dao/AvatarDao');

class UserService {
  constructor() {}

  async findUserById(id) {
    const user = await new UserDao().findById(id);
    const res = new Response();
    return res.success({ ...user, avatar: `/api/showmd/user/avatar/${id}` });
  }

  async findUserAvatar(userId) {
    const avatar = await new AvatarDao().findByUserId(userId);
    if (avatar) {
      return avatar.content;
    }
    return '';
  }
}

module.exports = UserService;