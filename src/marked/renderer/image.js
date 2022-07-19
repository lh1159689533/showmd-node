const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

module.exports = function image(href, title, text) {
  // console.log(href, title, text);
  const imgName = href.split('/').slice(-1)[0];
  const current = `/img/${dayjs().format('YYYY-MM-DD')}/${imgName}`;
  // await fs.renameSync(path.resolve(`temp/${current}`), path.resolve(`public/${current}`));
  return `<img src="${current}" alt="${text}" title="${title || ''}" width="100%" height="100%">`;
};