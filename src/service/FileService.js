const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const Response = require('../utils/Response');
const { getBasename, getExtname, getSize } = require('../utils/file');

const fse = fs.promises;

const MD_DEMO_DIR = 'md-demo';
const FILE_MAX_SIZE = 5; // 附件最大支持5MB

class ImageService {
  constructor() {}

  /**
   * 附件上传
   * @param {File} file
   * @returns Response
   */
  async upload(file) {
    const res = new Response();
    const { originalname, size } = file;
    if (size > FILE_MAX_SIZE * 1024) {
      return res.fail(`附件最大支持${FILE_MAX_SIZE}MB`);
    }
    const name = getBasename(originalname);
    const fileName = `${name}_${dayjs().format('YYYYMMDDHHmmss')}${getExtname(originalname)}`;
    const fileContent = file.buffer;

    try {
      const dir = path.resolve(`public/${MD_DEMO_DIR}`);
      const isExist = fs.existsSync(dir);
      if (!isExist) await fse.mkdir(dir, { recursive: true });
      await fse.writeFile(`${dir}/${fileName}`, fileContent);
      return res.success({ name: originalname, size: getSize(size), path: `${MD_DEMO_DIR}/${fileName}` });
    } catch (e) {
      return res.fail('文件上传失败');
    }
  }
}

module.exports = ImageService;
