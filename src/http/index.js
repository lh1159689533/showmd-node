const axios = require("./axios");

function request(props) {
  const { apiurl, data, headers, segment, prefix } = props;
  const apiUrlArr = apiurl.split(' ');
  let url = '', method = 'get';
  if (apiUrlArr.length === 2) {
    [method, url] = apiUrlArr;
  } else {
    [url] = apiUrlArr;
  }

  if (segment) {
    url = url.replace(/:(\w+)/g, ($0, $1) => segment[$1].toString());
  }

  if (prefix) {
    url = prefix + url;
  }

  const config = {
    url,
    method,
  };

  if (method === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  if (headers) {
    config.headers = headers;
  }
  // return http[method](url, data, headers);
  return new Promise(resolve => {
    axios(config).then((result) => {
      resolve([null, result]);
    }).catch((err) => {
      resolve([err, null]);
    });
  });
}

module.exports = {
  request
};
