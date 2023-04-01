/**
 * 登录鉴权，对和当前登录用户相关的接口进行鉴权，未登录则无法继续操作
 */
function auth(req, res, next) {
  if (!req.currentUser?.id) {
    return next(new Error('UnauthorizedError'));
  }
  next();
}

module.exports = auth;