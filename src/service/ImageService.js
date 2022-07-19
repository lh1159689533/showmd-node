const dayjs = require('dayjs');
const sharp = require('sharp');
const Response = require('../utils/Response');
const GithubService = require('./GithubService');
const {
  github: { repo, username, token },
} = require('../config');

class ImageService {
  constructor() {}

  async upload(files) {
    const { originalname: imgName, buffer } = files[0];
    const [name, suffix] = imgName.split('.');
    const fileName = `${dayjs().format('YYYY-MM-DD')}/${name}.webp`;
    let animated = false;
    if (suffix === 'gif') {
      animated = true;
    }
    // 图片压缩并转为webp格式
    const data = await sharp(buffer, { animated }).webp().toBuffer();
    const fileContent = data.toString('base64');
    const isSucc = await new GithubService(username, repo, token).saveFileContent(fileName, fileContent);

    const res = new Response();
    if (isSucc) {
      return res.success({ name: imgName, path: `showmd/file/preview?filename=${encodeURI(fileName)}`}).toString();
    }
    return res.fail('文件上传失败').toString();
  }

  async preview(fileName) {
    return await new GithubService(username, repo, token).getRepoDirFileContent(fileName);
  }
}

module.exports = ImageService;