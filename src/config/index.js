module.exports = {
  logger: {
    path: 'logs', // 日志目录
    level: "debug",  // 日志级别
    maxFiles: "15d" // 日志最大天数,超过时间删除
  },
  github: {
    username: 'lh1159689533',
    repo: 'myImageServer',
    token: 'Z2hwX1ZhMU9NZk5QM0hnWXNnQlhkTnNTTEhjRTZMWW1WWTFUeWJ3Zg==',
  },
  db: {
    dialect: 'sqlite',
    storage: 'db/showmd.db'
  },
  user: {
    avatarPrefix: '/api/showmd/user/avatar', // 用户头像地址前缀
  }
};
