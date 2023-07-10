const userParser = require('../utils/userParser');

/**
 * 挂载当前登录用户
 */
function setCurrentUser(req, res, next) {
  const currentUser = userParser(req);

  req.currentUser = currentUser;
  next();
}

module.exports = setCurrentUser;