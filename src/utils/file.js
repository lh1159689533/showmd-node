const path = require('path');

/**
 * 获取文件名,不带扩展
 * @param {String} fileName 文件名
 */
const getBasename = (fileName) => {
  const extname = getExtname(fileName);
  return path.basename(fileName, extname);
};

/**
 * 获取文件扩展名
 * @param {String} fileName 文件名
 * @returns 文件扩展名
 * @example index.html ---> .html
 */
const getExtname = (fileName) => {
  return path.extname(fileName);
};

/**
 * 将文件大小转化为带单位的大小
 * @param {Number} size 
 */
const getSize = (size) => {
  if (size / 1024 / 1024 >= 1) {
    return (size / 1024 / 1024).toFixed(2) + 'MB';
  }
  if (size / 1024 >= 0.1) {
    return (size / 1024).toFixed(2) + 'KB';
  }
  return size.toFixed(2) + 'B';
};

module.exports = {
  getBasename,
  getExtname,
  getSize
};
