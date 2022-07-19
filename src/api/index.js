const githubApi = require('./github.api');

const api = [githubApi].reduce((redu, item) => {
  const current = {};
  for (let key in item.apis) {
    current[`${item.namespace}/${key}`] = item.apis[key];
  }
  return {
    ...redu,
    ...current
  };
}, {});

module.exports = api;