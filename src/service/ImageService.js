const dayjs = require('dayjs');
const sharp = require('sharp');
const Response = require('../utils/Response');
const githubService = require('./GithubService');

const IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

class ImageService {
  constructor() {}

  /**
   * 图片上传到github仓库
   * @param {File} file 
   * @returns Response
   */
  async upload(file) {
    const { originalname: imgName } = file;
    const [name] = imgName.split('.');
    const fileName = `${dayjs().format('YYYY-MM-DD')}/${name}_${dayjs().format('YYYYMMDDHHmmss')}.webp`;
    const fileContent = await this.compress(file);
    const isSucc = await githubService.saveFileContent(fileName, fileContent);

    const res = new Response();
    if (isSucc) {
      return res.success({ name: imgName, path: `showmd/file/preview?filename=${encodeURI(fileName)}`});
    }
    return res.fail('文件上传失败');
  }

  async preview(fileName) {
    return await githubService.getRepoDirFileContent(fileName);
  }

  /**
   * 图片压缩处理并转为webp格式
   * @param {File} file 
   * @returns 图片base64格式内容
   */
  async compress(file) {
    // 只处理图片
    if (!IMAGE_TYPE.includes(file?.mimetype)) {
      return file;
    }
    const { buffer, mimetype } = file;
    let animated = false;
    if (mimetype === 'image/gif') {
      animated = true;
    }
    // 图片压缩并转为webp格式
    const data = await sharp(buffer, { animated }).webp().toBuffer();
    return data.toString('base64');
  }
}

module.exports = ImageService;