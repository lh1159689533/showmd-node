const axios = require('axios');

let PREFIX = "/api",
  IP = "";
if (process.env.NODE_ENV === "development") {
  PREFIX = "/api";
  IP = "http://localhost:8080";
}

// 创建axios实例
const instance = axios.create({
  timeout: 50000,
});

// request拦截器
instance.interceptors.request.use(
  (config) => {
    config.url = config.url;
    
    if (config.url.endsWith(".json")) {
      config.url = IP + config.url.replace("/api", "");
    } else if (config.url.endsWith("picture/upload")) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error);
    Promise.reject(error);
  }
);

// respone拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      let data = response.data;
      let contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1 && typeof data === 'string') {
        data = JSON.parse(data);
      }
      return data;
    } else {
      return Promise.reject("error:" + response.status);
    }
  },
  (e) => {
    console.log("err:" + e.message);
    return Promise.reject(e);
  }
);

module.exports = instance;
