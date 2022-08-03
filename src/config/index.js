module.exports = {
  logger: {
    path: 'logs', // 日志目录
    level: "info",  // 日志级别
    maxFiles: "15d" // 日志最大天数,超过时间删除
  },
  github: {
    username: 'lh1159689533',
    repo: 'myImageServer',
    token: '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',
  },
  db: {
    dialect: 'sqlite',
    storage: 'db/showmd.db'
  }
};
