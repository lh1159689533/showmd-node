const dayjs = require('dayjs');
const sharp = require('sharp');
const logger = require('../logger');
const Response = require('../utils/Response');
const githubService = require('./GithubService');
const ImageDao = require('../dao/ImageDao');
const { uploadChunk, merge } = require('../utils/sliceUploadFile');
const { isImageFile, isGIFImage } = require('../utils/types');

class ImageService {
  constructor() {}

  /**
   * 图片上传到github仓库
   * @param {File} file
   * @returns Response
   */
  async uploadToGithub(file) {
    const { originalname: imgName } = file;
    const [name] = imgName.split('.');
    const fileName = `${dayjs().format('YYYY-MM-DD')}/${name}_${dayjs().format('YYYYMMDDHHmmss')}.webp`;
    const fileContent = await this.compress(file);
    const isSucc = await githubService.saveFileContent(fileName, fileContent);

    const res = new Response();
    if (isSucc) {
      return res.success({ name: imgName, path: `showmd/file/preview?filename=${encodeURI(fileName)}` });
    }
    return res.fail('文件上传失败');
  }

  async previewFromGithub(fileName) {
    return await githubService.getRepoDirFileContent(fileName);
  }

  /**
   * 图片上传
   * @param {File} file
   * @returns Response
   */
  async upload(file) {
    const { originalname: imgName } = file;
    const [name] = imgName.split('.');
    const fileName = `${name}_${dayjs().format('YYYYMMDDHHmmss')}.webp`;
    const fileContent = await this.compress(file);
    const [id, err] = await new ImageDao().save({ name: fileName, content: fileContent });

    const res = new Response();
    if (!err) {
      return res.success({ name: imgName, path: `showmd/file/preview/${id}` });
    }
    return res.fail('文件上传失败');
  }

  /**
   * 图片预览
   * @param {Number} id 图片id
   * @returns base64/image
   */
  async preview(id) {
    const image = await new ImageDao().findById(id);
    return image?.content;
  }

  /**
   * 大图片分片上传
   * @param {File} file
   * @param {String} uploadId 上传id，标识同一个文件
   * @param {Number} chunkNum 切片编号
   * @param {Object} mergeData 合并数据
   */
  async sliceUpload(file, uploadId, chunkNum, mergeData) {
    const res = new Response();
    if (!mergeData?.merge) {
      // 上传切片
      const isSucc = await uploadChunk(file, uploadId, chunkNum);
      if (isSucc) {
        return res.success();
      }
      return res.fail();
    } else {
      // 合并
      const fileName = `${mergeData.fileName}_${dayjs().format('YYYYMMDDHHmmss')}.webp`;
      const fileContent = await merge(uploadId, mergeData.merge);
      // 原始数据先入库，避免压缩图片慢导致阻塞，异步处理后更新到库
      const [id, err] = await new ImageDao().save({ name: fileName, content: fileContent });
      if (!err) {
        // 压缩图片
        this.compress({ buffer: fileContent, mimetype: mergeData.fileType }).then(data => {
          new ImageDao().save({ id, content: data });
        });
        return res.success({ name: fileName, path: `showmd/file/preview/${id}` });
      }
      logger.error('文件上传失败: ', err);
      return res.fail('文件上传失败');
    }
  }

  /**
   * 图片压缩处理并转为webp格式
   * @param {File} file
   * @returns 图片base64格式内容
   */
  async compress(file) {
    // 只处理图片
    if (!isImageFile(file)) {
      return file;
    }
    let animated = false;
    if (isGIFImage(file)) {
      animated = true;
    }
    try {
      // 图片压缩并转为webp格式
      return await sharp(file.buffer, { animated, limitInputPixels: false }).webp().toBuffer();
    } catch (e) {
      logger.error('图片压缩报错:', e);
      return null;
    }
  }

  /**
   * 图片压缩处理并转为webp格式
   * @param {File} file 图片数据
   * @param {width, height} resize 图片宽高
   * @returns 图片base64格式内容
   */
  async compressAndResize(file, resize) {
    // 只处理图片
    if (!isImageFile(file) || !resize) {
      return file;
    }
    let animated = false;
    if (isGIFImage(file)) {
      animated = true;
    }
    const { width, height } = resize;
    try {
      return await sharp(file.buffer, { animated, limitInputPixels: false }).resize({ width, height, fit: 'fill' }).webp().toBuffer();
    } catch (e) {
      logger.error('图片压缩报错:', e);
      return null;
    }
  }
}

module.exports = ImageService;
