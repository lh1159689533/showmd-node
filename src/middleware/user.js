const cookie = require('cookie');
const token = require('../utils/token');

/**
 * 解析cookie中的token，得到当前登录用户信息
 */
function currentUserParser(req, res, next) {
  if (!req.headers.cookie) return next();

  const cookies = cookie.parse(req.headers.cookie);
  if (!cookies?.token) {
    return next();
  }

  try {
    req.currentUser = token.parse(cookies.token);
  } finally {
    next();
  }
}

module.exports = currentUserParser;
