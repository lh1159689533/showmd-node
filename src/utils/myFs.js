const fs = require('fs');
const path = require('path');

module.exports = {
  mkdirSync(...args) {
    // recursive=true时创建目录，如果目录存在则返回undefined(recursive=false会报错)，目录不存在则创建并返回创建的第一个目录路径(可创建多层目录)
    const dir = path.resolve(...args);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  },
  writeFile(fileName, data) {
    fs.writeFile(path.resolve(fileName), data, () => {});
  }
};