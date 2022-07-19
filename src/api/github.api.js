module.exports = {
  namespace: 'github',

  apis: {
    // 获取仓库下内容列表
    getRepoContents: 'repos/:username/:repo/contents',
    // 获取目录下文件列表
    getRepoDirFiles: 'repos/:username/:repo/contents/:directory',
    // 获取文件内容(base64编码)
    getRepoDirFileContent: 'repos/:username/:repo/contents/:filename',
    // 保存文件(base64编码)
    saveFileContent: 'put repos/:username/:repo/contents/:path'
  }
};