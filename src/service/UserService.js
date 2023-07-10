const Response = require('../utils/Response');
const UserDao = require('../dao/UserDao');
const AvatarDao = require('../dao/AvatarDao');
const token = require('../utils/token');
const logger = require('../logger');
const { ROLE_TYPE } = require('../constant');

class UserService {
  constructor() {}

  async login(req, resp) {
    const { userName, password } = req.body;
    const user = await new UserDao().findOne({ name: userName });
    const res = new Response();
    if (user?.password === password) {
      // 登录成功将token存入cookie
      resp.cookie('token', token.get(user));
      return res.success();
    }
    return res.fail('用户名或密码不正确');
  }

  async register(req, resp) {
    const userDao = new UserDao();
    const res = new Response();
    const { userName, password } = req.body;
    const user = { name: userName, password, roleId: ROLE_TYPE.NORMAL };
    const [id, err] = await userDao.save({ name: userName, password, roleId: ROLE_TYPE.NORMAL });
    if (err) {
      logger.error('注册用户出错:', err);
      return res.fail('用户注册失败');
    }
    logger.debug('注册用户:', user?.name);
    // 注册成功将token存入cookie
    resp.cookie('token', token.get({ id, ...user }));
    return res.success(null, '用户注册成功');
  }

  async checkUserName(userName) {
    const user = await new UserDao().findOne({ name: userName });
    const res = new Response();
    if (user) {
      return res.fail('用户名已占用');
    }
    return res.success();
  }

  async findUserInfo(currentUser) {
    return await this.findUserById(currentUser.id);
  }

  async findUserById(id) {
    const user = await new UserDao().findById(id);
    const res = new Response();
    if (user) {
      return res.success({ ...user, avatar: `/api/showmd/user/avatar/${id}` });
    }
    return res.fail();
  }

  async findUserAvatar(userId) {
    const avatar = await new AvatarDao().findByUserId(userId);
    if (avatar) {
      return avatar.content;
    }
    return '';
  }

  async update(user) {
    const userDao = new UserDao();
    const res = new Response();
    const [id, err] = await userDao.save(user);
    if (err) {
      logger.error(`${user?.id ? '更新' : '新建'}用户出错:`, err);
      return res.fail(`${user?.id ? '更新' : '新建'}用户出错`);
    }

    logger.debug(`${user?.id ? '更新' : '新建'}用户:`, user?.name);
    return res.success(id);
  }
}

module.exports = UserService;
