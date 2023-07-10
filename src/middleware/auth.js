const userParser = require('../utils/userParser');

/**
 * 登录鉴权，对和当前登录用户相关的接口进行鉴权，未登录则无法继续操作
 */
function auth(req, res, next) {
  const currentUser = userParser(req);

  if (!currentUser) {
    return next(new Error('UnauthorizedError'));
  }

  req.currentUser = currentUser;
  next();
}

/**
 * 解析cookie中的token，得到当前登录用户信息
 */
// function userParser(req) {
//   if (!req.headers.cookie) return null;

//   const cookies = cookie.parse(req.headers.cookie);
//   if (!cookies?.token) {
//     return null;
//   }

//   let currentUser = null;

//   try {
//     currentUser = token.parse(cookies.token);
//     console.log('currentUser:', currentUser);
//   } catch (e) {
//     console.log('jwt err:', e.name ?? e.message);
//   } finally {
//     return currentUser;
//   }
// }

module.exports = auth;