const jwt = require('jsonwebtoken');
const {
  user: { secretKey, expires },
} = require('../config');

const secret = Buffer.from(secretKey, 'base64').toString();

/**
 * 获取token
 * @param {object} user 用户信息
 */
const get = (user) => {
  return jwt.sign(user, secret, { algorithm: 'HS256', expiresIn: expires });
};

/**
 * 解析token获得当前登录用户
 * @param {String} token
 */
const parse = (token) => jwt.verify(token, secret, { algorithms: ['HS256'] });

/**
 * token鉴权
 */
// const authToken = () => {
//   return expressjwt({
//     secret,
//     algorithms: ['HS256'],
//     getToken: function fromHeaderOrQuerystring(req) {
//       if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'token') {
//         return req.headers.authorization.split(' ')[1];
//       } else if (req.query && req.query.token) {
//         return req.query.token;
//       }
//       return null;
//     },
//   }).unless({
//     path: ['/showmd/user/login', '/showmd/user/check'],
//   });
// };

module.exports = {
  get,
  parse,
  // authToken,
};
