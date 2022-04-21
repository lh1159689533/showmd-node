const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const Marked = require('../marked');
const logger = require('../logger');

class UploadMd {
  constructor() { }

  static run(req) {
    new UploadMd().resolve(req);
  }

  parse(req, uploadDir) {
    console.log(uploadDir);
    const form = new multiparty.Form({ uploadDir });
    return new Promise(resolve => {
      form.parse(req, (err, _, files) => {
        console.log(err, files);
        if (!err && files?.file?.length) {
          resolve(files.file);
        } else {
          resolve([]);
        }
      });
    });
  }

  async readMd(dir) {
    const files = await fs.readdirSync(path.resolve(dir), { withFileTypes: true });
    const mdFiles = [];
    for (let i = 0, len = files.length; i < len; i++) {
      const f = files[i];
      if (f?.isFile() && f?.name?.endsWith('.md')) {
        mdFiles.push(`${dir}/${f.name}`);
      }
      if (f?.isDirectory()) {
        const childFiles = await this.readMd(`${dir}/${f.name}`);
        mdFiles.push(...childFiles);
      }
    }

    return mdFiles;
  }

  async resolve(req) {
    const tempDir = path.resolve(`temp/${dayjs().format('YYYY-MM-DD')}`);
    // recursive=true时创建目录，如果目录存在则返回undefined(recursive=false会报错)，目录不存在则创建并返回创建的目录路径
    await fs.mkdirSync(tempDir, { recursive: true });
    const files = await this.parse(req, tempDir);
    logger.info('files:', files);
    if (files?.length) {
      files.map(f => {

      });
    }
  }
}

module.exports = UploadMd;