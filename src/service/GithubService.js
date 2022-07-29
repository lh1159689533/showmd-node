const http = require('../http');
const api = require('../api');
const logger = require('../logger');
const Service = require('./Service');
const {
  github: { repo, username, token },
} = require('../config');

class GithubService extends Service {
  constructor(username, repo, token) {
    super({ username, repo, token });
    this.prefix = 'https://api.github.com/';
  }

  /**
   * 查询仓库下目录信息, 只限一级目录
   */
  async getRepoDirInfo(directory) {
    logger.debug(`获取目录${directory}详细信息.`);

    const [err, result] = await http.request({
      prefix: this.prefix,
      apiurl: api['github/getRepoContents'],
      headers: {
        Authorization: `token ${this.token}`
      },
      segment: {
        username: this.username,
        repo: this.repo
      }
    });
    if (err) {
      logger.error(`获取目录${directory}详细信息报错:`, err);
      return null;
    }

    logger.debug(`目录${directory}详细信息已获取.`);

    const dirInfo = (result || []).find(item => item.type === 'dir' && item.name === directory);

    return dirInfo;
  }

  /**
   * 查询仓库目录下文件列表
   * @param {String} directory 文档目录, 默认doc
   * @returns 
   */
  async getRepoDirFiles(directory = 'doc') {
    logger.debug(`获取目录${directory}下文件列表`);

    const [err, result] = await http.request({
      prefix: this.prefix,
      apiurl: api['github/getRepoDirFiles'],
      headers: {
        Authorization: `token ${this.token}`
      },
      segment: {
        username: this.username,
        repo: this.repo,
        directory
      }
    });
    if (err) {
      logger.error(`获取目录${directory}下文件列表报错:`, err);
    } else {
      logger.info(`目录${directory}下文件列表已获取.`);
    }

    return result || [];
  }

  /**
   * 获取文件内容
   * @param {String} filename 文件名
   */
  async getRepoDirFileContent(filename) {
    logger.debug(`获取文件${filename}内容.`);

    const [err, result] = await http.request({
      prefix: this.prefix,
      apiurl: api['github/getRepoDirFileContent'],
      headers: {
        Authorization: `token ${this.token}`
      },
      segment: {
        username: this.username,
        repo: this.repo,
        filename: encodeURI(filename)
      }
    });
    if (err) {
      logger.error(`获取文件${filename}内容报错:`, err);
      return null;
    }

    logger.info(`文件${filename}内容已获取.`);
    return (result && Buffer.from(result.content, 'base64'));
  }

  /**
   * 获取文件内容
   * @param {String} filename 文件名
   */
  async saveFileContent(fileName, fileContent) {
    const [err, result] = await http.request({
      prefix: this.prefix,
      apiurl: api['github/saveFileContent'],
      headers: {
        Authorization: `token ${this.token}`
      },
      segment: {
        username: this.username,
        repo: this.repo,
        path: encodeURI(fileName)
      },
      data: {
        message: '',
        content: fileContent
      }
    });

    if (err) {
      logger.error(`保存文件${fileName}内容报错:`, err);
      return null;
    }
    logger.info(`文件${fileName}内容已保存.`);
    return result?.content;
  }

  /**
   * 删除文件
   * @param {String} fileName 文件名称
   */
  async deleteFile(fileName) {
    const [err] = await http.request({
      prefix: this.prefix,
      apiurl: api['github/deleteFile'],
      headers: {
        Authorization: `token ${this.token}`
      },
      segment: {
        username: this.username,
        repo: this.repo,
        path: encodeURI(fileName)
      },
    });

    if (err) {
      logger.error(`删除文件${fileName}报错:`, err);
      return false;
    }
    logger.info(`文件${fileName}已删除.`);
    return true;
  }
}

module.exports = new GithubService(username, repo, token);