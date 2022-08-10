const fs = require('fs').promises;
const path = require('path');
const Avatar = require('../model/Avatar');

(async () => {
  fs.readFile(path.resolve('public/avatars.jpeg')).then(buffer => {
    Avatar.create({ content: buffer, userId: 1 });
  }).catch(e => {
    console.log(e);
  });
})();
