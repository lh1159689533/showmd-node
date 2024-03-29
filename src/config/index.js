module.exports = {
  logger: {
    path: 'logs', // 日志目录
    level: 'debug', // 日志级别
    maxFiles: '15d', // 日志最大天数,超过时间删除
  },
  github: {
    username: 'lh1159689533',
    repo: 'myImageServer',
    token: 'Z2hwX1ZhMU9NZk5QM0hnWXNnQlhkTnNTTEhjRTZMWW1WWTFUeWJ3Zg==',
  },
  db: {
    dialect: 'sqlite',
    storage: 'db/showmd.db',
  },
  user: {
    avatarPrefix: '/api/showmd/user/avatar', // 用户头像地址前缀
    secretKey: 'bGFuaXNtZA==', // 登录鉴权Token密钥
    expires: 7 * 24 * 60 * 60, // 登录鉴权Token有效期7d
  },
  minio: {
    endPoint: '119.8.232.109',
    port: 9000,
    accessKey: 'kngnr1BB2lAzW9EE',
    secretKey: 'rsTBC9KKhgaGK8uYZwI9pSMNcBHcmPLf',
    bucket: 'showmd',
  },
};
