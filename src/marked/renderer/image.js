const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

module.exports = async function image(href, title, text) {
  console.log(href, title, text);
  const current = `${dayjs().format('YYYY-MM-DD')}/${href}`;
  await fs.renameSync(path.resolve(`temp/${current}`), path.resolve(`public/${current}`));
  return `<img src="${encodeURIComponent(href)}" alt="${text}" title="${title}">`;
};