const cookie = require('cookie');
const token = require('../utils/token');

module.exports = function userParser(req) {
  if (!req.headers.cookie) return null;

  const cookies = cookie.parse(req.headers.cookie);
  if (!cookies?.token) {
    return null;
  }

  let currentUser = null;

  try {
    currentUser = token.parse(cookies.token);
  } catch (e) {
    console.log('jwt err:', e.name ?? e.message);
  }
  return currentUser;
};
