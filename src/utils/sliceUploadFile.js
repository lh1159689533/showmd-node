const path = require('path');
const fs = require('fs');
const fse = fs.promises;
const logger = require('../logger');

const SLICE_UPLOAD_TEMPDIR = path.resolve('public/temp');

/**
 * 上传切片文件
 * @param {File} chunk 切片文件
 * @param {String} uploadId 上传id，标识同一个文件
 * @param {Number} chunkNum 切片序号
 */
async function uploadChunk(chunk, uploadId, chunkNum) {
  try {
    const dir = `${SLICE_UPLOAD_TEMPDIR}/${uploadId}`;
    const isExist = fs.existsSync(dir);
    if (!isExist) await fse.mkdir(dir, { recursive: true });
    await fse.writeFile(`${dir}/${chunkNum}`, chunk.buffer);
    return true;
  } catch (e) {
    logger.error(`上传切片文件报错: 切片序号 = ${chunkNum},`, e);
    return false;
  }
}

/**
 * 合并
 * @param {String} uploadId 上传id，标识同一个文件
 * @param {Object} mergeData { merge, fileType } merge包含切片id(与临时切片文件名一致,逗号分隔,务必保证顺序), fileType为文件类型
 * @returns 
 */
async function merge(uploadId, mergeData) {
  // 读取切片文件
  const chunkNumList = mergeData.split(',').filter((item) => item);
  const bufferList = [];
  let totalLen = 0;
  for (let i = 0; i < chunkNumList.length; i++) {
    const chunkNum = chunkNumList[i];
    const buffer = await fse.readFile(`${SLICE_UPLOAD_TEMPDIR}/${uploadId}/${chunkNum}`);
    totalLen += buffer.length;
    bufferList.push(buffer);
  }

  // 删除切片文件
  clearTemp(uploadId);

  // 拼接
  const buffer = Buffer.concat(bufferList, totalLen);

  return buffer;
}

/**
 * 删除临时切片文件
 * @param {String} uploadId 上传id，标识同一个文件
 */
function clearTemp(uploadId) {
  logger.debug(`文件分片上传成功，删除临时文件: uploadId = ${uploadId}`);
  fse.rm(`${SLICE_UPLOAD_TEMPDIR}/${uploadId}`, { recursive: true, force: true });
}

module.exports = {
  uploadChunk,
  merge
};
